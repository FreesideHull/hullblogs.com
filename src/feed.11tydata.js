const do_feeds = require("./lib/do_feeds.js");

module.exports = async function() {
	const { feed_items, feeds_errored } = await do_feeds();
	
	return {
		permalink: "feed.xml",
		eleventyExcludeFromCollections: true,
		metadata: {
			title: "hullblogs.com",
			subtitle: "Aggregated content from University of Hull students and alumni irrespective of department. Read how our students and alumni are changing the world in their own words.",
			language: "en",
			url: "https://hullblogs.com/",
			author: {
				name: "hullblogs.com",
				uri: "https://hullblogs.com/",
			}
		},
		feed_items
	}
}
