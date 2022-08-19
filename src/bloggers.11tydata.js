"use strict";

const path = require("path");
const fs = require("fs");

const fetch_json = require("./lib/fetch_json.js");
const shuffle = require("./lib/shuffle.js");

async function fetch_info(blogger) {
	if(typeof blogger.github_username !== "string") return;
	
	const github_userdata = (await fetch_json(`https://api.github.com/users/${blogger.github_username}`)).body;
	
	if(typeof github_userdata.message === "string") {
		console.error(github_userdata.message);
	}
	
	blogger.bio = github_userdata.bio;
	blogger.url_blog = github_userdata.blog;
	blogger.url_github = github_userdata.html_url;
	blogger.url_twitter = github_userdata.twitter_username === null ? null : `https://twitter.com/@${github_userdata.twitter_username.replace(/^@/, "")}`;
	blogger.url_avatar = github_userdata.avatar_url;
	
	// If the link to the blog doesn't include a protocol, default to https.
	// If this breaks your blog, then you should enable https to fix the issue.
	// ALL Internet traffic should be encrypted. Your blog is not an exception.
	if(blogger.url_blog.search(/^[a-zA-Z]+:\/\//) === -1)
		blogger.url_blog = `https://${blogger.url_blog}`;
	
	if(typeof blogger.url_blog !== "string" || blogger.url_blog.length == 0)
		blogger.url_blog = null;
}

module.exports = async function() {
	const feeds_data = JSON.parse(await fs.promises.readFile(path.resolve(__dirname, "../feeds.json"), "utf-8"));
	await Promise.all(feeds_data.map(fetch_info));
	
	shuffle(feeds_data); // Don't give any 1 person the advantage
	
	return {
		layout: "main.njk",
		title: "Bloggers",
		tags: "navigable",
		date: "2001-01-01",
		bloggers: feeds_data
	}
}