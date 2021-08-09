const fs = require("fs");
const path = require("path");

const pReflect = require("p-reflect");
const dateformat = require("dateformat");
const striptags = require("striptags");

const fetch_feed = require("./lib/fetch_feed.js");

// The length of auto-generated descriptions if one isn't provided.
const DESCRIPTION_LENGTH = 200;

module.exports = async function() {
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
	const feed_authors_error = feed_data.filter(el => el.data.isRejected)
		.map(el => el.author_name);
	
	const feed_items = [].concat(...feed_data_ok.map(feed => feed.data.items.map(item => {
		// console.log(`FEED ITEM`, item);
		item.author_name = feed.author_name;
		item.parent = feed.data;
		
		if(!item.content) item.content = item["content:encoded"] || "";
		if(!item.description) item.description = striptags(item.content)
			.substr(0, DESCRIPTION_LENGTH);
		
		if(!item.pubdate) item.pubdate = item.published
			|| item.updated
			|| new Date("1970-01-01");
		
		item.pubdate_iso = new Date(item.pubdate).toISOString();
		item.pubdate_display = dateformat(
			new Date(item.pubdate),
			"ddd dS mmmm yyyy h:MM:ss TT Z"
		);
		return item;
	})));
	
	return {
		layout: "main.njk",
		title: "Posts",
		tags: "navigable",
		date: "2000-01-01", // For sorting in the navigation bar
		feed_items: feed_items,
		feeds_errored: feed_authors_error,
		pagination: {
			data: "feed_items",
			size: 15
		}
	};
}
