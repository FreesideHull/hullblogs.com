const fetch_stream = require("./fetch_stream.js");
const FeedMe = require("feedme");
const events = require("events");

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
	let result = await do_parse(
		await fetch_stream(url)
	);
	console.log(`FETCH ${new Date() - start}ms ${url}`);
	
	return result;
}

module.exports = fetch_feed;
