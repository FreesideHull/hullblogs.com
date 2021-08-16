const Futility = require("futility").default;
const striptags = require("striptags");

const checker = new Futility();

/**
 * Checks the words in the given string for bad (swear) words.
 * Checks on a word level - therefore avoiding the "scunthorpe problem".
 * @param	{string}	str		The string to check.
 * @return	{boolean}	Truee if the given string contains any bad words, or false if it does not.
 */
function check_text(str) {
	const words = striptags(str).split(/\s+/);
	
	for(let word of words) {
		if(word.trim().search(/^\*+$/) > -1) continue;
		let replaced = checker.censor(word, "*");
		if(replaced.trim().search(/^\*+$/) > -1)
			return true;
	}
	return false;
}

module.exports = check_text;
