const fs = require("fs");
const path = require("path");

const pReflect = require("p-reflect");
const dateformat = require("dateformat");
const striptags = require("striptags");

const fetch_feed = require("./lib/fetch_feed.js");

// The length of auto-generated descriptions if one isn't provided.
const DESCRIPTION_LENGTH = 200;

global.feed_items = null;
global.feed_authors_error = null;

module.exports = async function() {
	if(global.feed_items === null) {
		const feeds = JSON.parse(await fs.promises.readFile("../feeds.json", "utf-8"));
		
		const feed_data = await Promise.all(feeds.map(async (feed) => { return {
			author_name: feed.author_name,
			author_image: `https://avatars.githubusercontent.com/${encodeURIComponent(feed.github_username)}`,
			data: await pReflect(fetch_feed(feed.feed_uri))
		} }));
		const feed_data_ok = feed_data.filter(el => {
			return el.data.isFulfilled
		})
		.map((feed) => {
			feed.data = feed.data.value;
			return feed;
		});
		global.feed_authors_error = feed_data.filter(el => el.data.isRejected)
		.map(el => el.author_name);
		
		global.feed_items = [].concat(...feed_data_ok.map(feed => feed.data.items.map(item => {
			item.author_name = feed.author_name;
			item.author_image = feed.author_image;
			item.parent = feed.data;
			if(typeof(item.link) == "object" && typeof(item.link.href) == "string")
				item.link = item.link.href;
			
			if(!item.content) item.content = item["content:encoded"] || "";
			if(!item.description) item.description = striptags(item.content)
			.substr(0, DESCRIPTION_LENGTH);
			
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
			console.log(`MEDIA IMAGE`, item.media_image);
			
			if(typeof process.env["DEBUG_FEEDITEMS"] != "undefined")
				console.log(`FEED ITEM`, item);
				
			return item;
		})));
		global.feed_items.sort((a, b) => b.pubdate_obj - a.pubdate_obj);
		// console.log(feed_items.map(el => el.title));
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
