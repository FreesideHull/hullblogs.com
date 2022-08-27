const do_feeds = require("./lib/do_feeds.js");

module.exports = async function() {
	const { feed_items, feeds_errored } = await do_feeds();
	
	return {
		layout: "main.njk",
		title: "Posts",
		tags: "navigable",
		date: "2000-01-01", // For sorting in the navigation bar
		feed_items,
		feeds_errored,
		pagination: {
			data: "feed_items",
			size: 15
		}
	};
}
