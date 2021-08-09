const fs = require("fs");
const path = require("path");
const os = require("os");

const phin = require("phin");

async function fetch_stream(url) {
	let package = JSON.parse(await fs.promises.readFile(
		path.join(path.dirname(path.dirname(__dirname)), "package.json"), "utf8"
	));
	
	return (await phin({
		url,
		headers: {
			"user-agent": `HullBlogsStaticBuilder/${package.version} (Node.js/${process.version}; ${os.platform()} ${os.arch()}) eleventy/${package.dependencies["@11ty/eleventy"].replace(/\^/, "")}`
		},
		followRedirects: true,
		stream: true
	}));
}


module.exports = fetch_stream;
