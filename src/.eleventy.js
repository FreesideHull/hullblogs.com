const os = require("os");
const fs = require("fs");
const path = require("path");

const striptags = require("striptags");
const htmlentities = require("html-entities");
const { SHA3 } = require("sha3");
const filetype = require("file-type");

const fetch = require("./lib/fetch.js");

function hash(str) {
	const hash = new SHA3(128);
	hash.update(str);
	return hash.digest("base64")
		.replaceAll("/", "-")
		.replaceAll("+", "_");
}

async function filter_asset(src) {
	let target_dir = `./_site/img`;
	if(!fs.existsSync(target_dir))
		await fs.promises.mkdir(target_dir, { recursive: true });
	let filename = path.basename(src);
	
	if(src.search(/https?/)) {
		let content = await fetch(src, "none");
		let type = await filetype.fromBuffer(content);
		// It's a URL - download it
		filename = `${hash(src)}.${type.ext}`;
		await fs.promises.writeFile(
			path.join(target_dir, filename),
			content
		);
	}
	else {
		// Generally speaking we optimise PNGs *very* well with oxipng/Zopfli,
		// and the Image plugin doesn't respect this
		await fs.promises.copyFile(src, path.join(target_dir, filename));
	}
	
	return `/img/${filename}`;
}

module.exports = function(eleventyConfig) {
	eleventyConfig.addFilter("striphtml", (value) => striptags(value));
	eleventyConfig.addFilter("htmlentities", (value) => htmlentities.encode(value));
	
	eleventyConfig.addFilter("asset", filter_asset);
	eleventyConfig.addAsyncShortcode("asset", filter_asset);
	eleventyConfig.addNunjucksAsyncShortcode("asset", filter_asset);
	
	// eleventyConfig.addAsyncShortcode("fetch", fetch);
	// 
	// // eleventyConfig.addPassthroughCopy("images");
	// // eleventyConfig.addPassthroughCopy("css");
	// eleventyConfig.addShortcode("image", shortcode_image);
	// eleventyConfig.addJavaScriptFunction("image", shortcode_image);
	// // eleventyConfig.addNunjucksAsyncShortcode("image_url", shortcode_image_url);
	// eleventyConfig.addAsyncShortcode("image_url", shortcode_image_url);
	// eleventyConfig.addAsyncShortcode("image_urlpass", shortcode_image_urlpass);
	// eleventyConfig.addNunjucksAsyncShortcode("image_urlpass", shortcode_image_urlpass);
	// eleventyConfig.addPairedShortcode("gallerybox", shortcode_gallerybox);
	
	return {
		htmlTemplateEngine: "njk"
	};
}
