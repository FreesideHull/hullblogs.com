const fs = require("fs");
const path = require("path");

const striptags = require("striptags");

const fetch_feed = require("./lib/fetch_feed.js");
const check_text = require("./lib/check_text.js");

// The length of auto-generated descriptions if one isn't provided.
const DESCRIPTION_LENGTH = 200;

global.feed_items = null;
global.feed_authors_error = null;

function normalise_link_list(links) {
	if(links instanceof Array) {
		let links_temp = links.filter(link => link.rel != "self");
		if(links.length == 0) links = links[0];
		else links = links_temp[0];
	}
	if(typeof(links) == "object") {
		if(typeof(links.href) == "string")
			links = links.href;
	}
	return links;
}

async function do_feeds() {
	const pReflect = (await import("p-reflect")).default;
	const dateformat = (await import("dateformat")).default;
	
	if(global.feed_items === null) {
		const feeds = JSON.parse(await fs.promises.readFile("../feeds.json", "utf-8"));
		
		const feed_data = await Promise.all(feeds.map(async (feed) => { return {
			author_name: feed.author_name,
			author_image: `https://avatars.githubusercontent.com/${encodeURIComponent(feed.github_username)}`,
			data: await pReflect(fetch_feed(feed.feed_uri))
		} }));
		const feed_data_ok = feed_data.filter(el => {
				return el.data.isFulfilled && el.data.value != null
			})
			.map((feed) => {
				feed.data = feed.data.value;
				if(typeof process.env["DEBUG_FEEDS"] != "undefined")
					console.log("FEED", feed.data);
				return feed;
			});
		
		global.feed_authors_error = feed_data
			.filter(el => el.data.isRejected|| el.data.value === null)
			.map(el => el.author_name);
		
		global.feed_items = [].concat(...feed_data_ok.map(feed => feed.data.items.map(item => {
			item.author_name = feed.author_name;
			item.author_image = feed.author_image;
			item.parent = feed.data;
			
			item.link = normalise_link_list(item.link);
			item.parent.link = normalise_link_list(item.parent.link);
			
			if(!item.content) item.content = item["content:encoded"] || "";
			
			// Support feed items with e.g. { type: "html", text: "...", ... }
			if(typeof item.content == "object") {
				if(item.content.type === "html" && typeof item.content.text === "string")
					item.content = item.content.text;
				else if(typeof item.summary === "string")
					item.content = item.summary;
			}
			
			if(typeof item.description !== "string") {
				if(typeof item.summary === "string")
					item.description = item.summary;
				else if(typeof item.content === "string")
					item.description = item.content;
			}
			
			item.description = striptags(item.content)
				.substring(0, DESCRIPTION_LENGTH);
			
			
			if(!item.pubdate) item.pubdate = item.published
			|| item.updated
			|| new Date("1970-01-01");
			item.pubdate_obj = new Date(item.pubdate);
			item.pubdate_iso = item.pubdate_obj.toISOString();
			item.pubdate_display = dateformat(
				item.pubdate_obj,
				"ddd dS mmmm yyyy h:MM:ss TT Z"
			);
			
			item.media_image = `./images/post.svg`;
			if(typeof(item["media:content"]) == "object" && item["media:content"].medium === "image")
				item.media_image = item["media:content"].url;
			else {
				// BUG: This is bad practice! We should use a propere HTML parser instead.
				let temp_image = item.content.match(/<img[^>]+?\bsrc=["']([^>]+?)["'][^>]+?\/?>/);
				if(temp_image !== null)
					item.media_image = temp_image[1];
			}
			item.media_image_notfound = item.media_image == `./images/post.svg`;
			if(!item.media_image_notfound)
				console.log(`MEDIA IMAGE`, item.media_image);
			
			if(typeof process.env["DEBUG_FEEDITEMS"] != "undefined")
				console.log(`FEED ITEM`, item);
				
			return item;
		})));
		global.feed_items.sort((a, b) => b.pubdate_obj - a.pubdate_obj);
		// console.log(feed_items.map(el => el.title));
		
		const magic_string = `__excludehullblogs__`;
		global.feed_items = global.feed_items.filter((item) => item.title.indexOf(magic_string) === -1
			&& item.description.indexOf(magic_string) === -1
			&& item.content.indexOf(magic_string) === -1)
		
		if(process.env.FILTER_FEED) {
			const feed_items_count = global.feed_items.length;
			global.feed_items = global.feed_items.filter((item) => !check_text(item.title)
				&& !check_text(item.description)
				&& !check_text(item.content));
			
			console.log(`>>> Feed filtering enabled, removed ${feed_items_count - global.feed_items.length} posts`);
		}
	}
	
	return {
		layout: "main.njk",
		title: "Posts",
		tags: "navigable",
		date: "2000-01-01", // For sorting in the navigation bar
		feed_items: global.feed_items,
		feeds_errored: global.feed_authors_error,
		pagination: {
			data: "feed_items",
			size: 15
		}
	};
}

var do_feeds_memoized = null;

module.exports = async function() {
	if(do_feeds_memoized == null) {
		const pMemoize = (await import("p-memoize")).default;
		do_feeds_memoized = pMemoize(do_feeds);
	}
	
	return await do_feeds_memoized();
}
