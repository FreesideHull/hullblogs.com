"use strict";

const fs = require("fs");
const path = require("path");

class DiskCache {
	constructor(dirpath_root, postfix=`pMemoize`, expire_after_ms=1000*60*60*24*7) {
		this.dirpath_root = dirpath_root;
		this.postfix = postfix;
		this.expire_after_ms = expire_after_ms;
		
		if(!fs.existsSync(dirpath_root))
			fs.mkdirSync(dirpath_root, { mode: 0o700, recursive: true })
	}
	
	#make_filename(key) {
		return path.join(
			this.dirpath_root,
			`${key.replace(/[^0-9a-zA-Z-_]/g, "")}.${this.postfix}.json`
		);
	}
	
	has(key) {
		return fs.existsSync(this.#make_filename(key));
	}
	
	async get(key) {
		const obj = JSON.parse(await fs.promises.readFile(this.#make_filename(key), "utf-8"));
		
		const now = new Date();
		obj.datetime = new Date(obj.datetime);
		
		// If it's expired, delete it from disk so we won't return it next time
		if(now - obj.datetime > this.expire_after_ms)
			await fs.promises.unlink(this.#make_filename(key));
		
		return obj.value;
	}
	
	async set(key, value) {
		await fs.promises.writeFile(
			this.#make_filename(key),
			JSON.stringify({
				value,
				datetime: (new Date()).toISOString()
			})
		);
	}
}

module.exports = DiskCache;