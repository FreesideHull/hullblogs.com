const fs = require("fs");
const path = require("path");
const os = require("os");

const phin = require("phin");

const package = JSON.parse(fs.readFileSync(
	path.join(path.dirname(path.dirname(__dirname)), "package.json"), "utf8"
));

async function fetch(url, format = "string") {
	const headers = {
		"user-agent": `HullBlogsStaticBuilder/${package.version} (Node.js/${process.version}; ${os.platform()} ${os.arch()}) eleventy/${package.dependencies["@11ty/eleventy"].replace(/\^/, "")}`
	};
	if(url.startsWith(`https://api.github.com/`) && process.env.GITHUB_TOKEN && process.env.GITHUB_USERNAME) {
		const { GITHUB_USERNAME, GITHUB_TOKEN } = process.env;
		headers.authorization = `Basic ${Buffer.from(`${GITHUB_USERNAME}:${GITHUB_TOKEN}`).toString(`base64`)}`;
	}
	
	return (await phin({
		url,
		headers,
		followRedirects: true,
		parse: format
	})).body;
}


module.exports = fetch;
