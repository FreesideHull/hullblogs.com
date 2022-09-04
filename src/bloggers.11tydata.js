"use strict";

const path = require("path");
const fs = require("fs");

const shuffle = require("./lib/shuffle.js");
const fetch_github_user_info = require("./lib/fetch_github_user_info.js");

module.exports = async function() {
	const author_names = new Set();
	
	const feeds_data = JSON.parse(await fs.promises.readFile(path.resolve(__dirname, "../feeds.json"), "utf-8"))
		.filter(feed_item => !author_names.has(feed_item.author_name) && author_names.add(feed_item.author_name));
	
	await Promise.all(feeds_data.map(fetch_github_user_info));
	
	shuffle(feeds_data); // Don't give any 1 person the advantage
	
	return {
		layout: "main.njk",
		title: "Bloggers",
		tags: "navigable",
		date: "2001-01-01",
		bloggers: feeds_data
	}
}