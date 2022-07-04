const fetch_stream = require("./fetch_stream.js");
const FeedMe = require("feedme");
const events = require("events");
const util = require("util");

function do_parse(stream) {
	return new Promise(function(resolve, reject) {
		const parser = new FeedMe(true);
		parser.once("error", reject);
		stream.pipe(parser);
		events.once(parser, "end").then(() => {
			parser.off("error", reject);
			resolve(parser.done());
		})
	});
}

async function fetch_feed(url) {
	let start = new Date();
	const fetch_result = await fetch_stream(url);
	if(fetch_result.statusCode < 200 || fetch_result.statusCode >= 300) {
		console.error(`FETCH ERROR ${new Date() - start}ms ${fetch_result.statusCode} ${url}`);
		return null;
	}
	let result = await do_parse(fetch_result);
	
	console.log(`FETCH ${new Date() - start}ms ${url}`);
	
	return result;
}

module.exports = fetch_feed;
