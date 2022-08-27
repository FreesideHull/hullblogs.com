const os = require("os");
const path = require("path");
const fs = require("fs");

const fetch = require("./fetch.js");
const DiskCache = require("./DiskCache.js");

const cache = new DiskCache(
	path.join(os.tmpdir(), "hullblogs"),
	postfix="github_userdata"
);

async function github_fetch_user(github_username) {
	if(cache.has(github_username)) {
		console.log(`>>> [cache:HIT] GITHUB_USER ${github_username}`);
		return await cache.get(github_username);
	}
	console.log(`>>> [cache:MISS] GITHUB_USER ${github_username}`);
	
	const result = await fetch(`https://api.github.com/users/${github_username}`, format="json");
	
	await cache.set(github_username, result);
	return result;
}

async function fetch_info(blogger) {
	if(typeof blogger.github_username !== "string") return;
	
	const github_userdata = await github_fetch_user(blogger.github_username);
	
	if(typeof github_userdata.message === "string") {
		console.error(github_userdata.message);
		return;
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


module.exports = fetch_info