(function () { var define = undefined; !function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Spellchecker=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

var Dictionary = function(dict) {
    this.rules = {};
    this.dictionaryTable = {};

    this.compoundRules = [];
    this.compoundRuleCodes = {};

    this.replacementTable = [];

    this.flags = {};

    if (dict) this.load(dict);
};

// Load from object
Dictionary.prototype.load = function (obj) {
    for (var i in obj) {
        this[i] = obj[i];
    }
};

// Return as JSON
Dictionary.prototype.toJSON = function(dictionary) {
    return {
        rules: this.rules,
        dictionaryTable: this.dictionaryTable,
        compoundRules: this.compoundRules,
        compoundRuleCodes: this.compoundRuleCodes,
        replacementTable: this.replacementTable,
        flags: this.flags
    };
};

// Parse a dictionary
Dictionary.prototype.parse = function(dictionary) {
    if (!dictionary.aff && !dictionary.dic) {
        throw "Invalid dictionary to parse";
    }


    this.rules = this._parseAFF(""+dictionary.aff);

    // Save the rule codes that are used in compound rules.
    this.compoundRuleCodes = {};

    for (var i = 0, _len = this.compoundRules.length; i < _len; i++) {
        var rule = this.compoundRules[i];

        for (var j = 0, _jlen = rule.length; j < _jlen; j++) {
            this.compoundRuleCodes[rule[j]] = [];
        }
    }

    // If we add this ONLYINCOMPOUND flag to this.compoundRuleCodes, then _parseDIC
    // will do the work of saving the list of words that are compound-only.
    if ("ONLYINCOMPOUND" in this.flags) {
        this.compoundRuleCodes[this.flags.ONLYINCOMPOUND] = [];
    }

    this.dictionaryTable = this._parseDIC(""+dictionary.dic);

    // Get rid of any codes from the compound rule codes that are never used
    // (or that were special regex characters).  Not especially necessary...
    for (var i in this.compoundRuleCodes) {
        if (this.compoundRuleCodes[i].length == 0) {
            delete this.compoundRuleCodes[i];
        }
    }

    // Build the full regular expressions for each compound rule.
    // I have a feeling (but no confirmation yet) that this method of
    // testing for compound words is probably slow.
    for (var i = 0, _len = this.compoundRules.length; i < _len; i++) {
        var ruleText = this.compoundRules[i];

        var expressionText = "";

        for (var j = 0, _jlen = ruleText.length; j < _jlen; j++) {
            var character = ruleText[j];

            if (character in this.compoundRuleCodes) {
                expressionText += "(" + this.compoundRuleCodes[character].join("|") + ")";
            }
            else {
                expressionText += character;
            }
        }

        this.compoundRules[i] = new RegExp(expressionText, "i");
    }
};

/**
 * Parse the rules out from a .aff file.
 *
 * @param {String} data The contents of the affix file.
 * @returns object The rules from the file.
 */
Dictionary.prototype._parseAFF = function (data) {
    var rules = {};

    // Remove comment lines
    data = this._removeAffixComments(data);

    var lines = data.split("\n");

    for (var i = 0, _len = lines.length; i < _len; i++) {
        var line = lines[i];

        var definitionParts = line.split(/\s+/);

        var ruleType = definitionParts[0];

        if (ruleType == "PFX" || ruleType == "SFX") {
            var ruleCode = definitionParts[1];
            var combineable = definitionParts[2];
            var numEntries = parseInt(definitionParts[3], 10);

            var entries = [];

            for (var j = i + 1, _jlen = i + 1 + numEntries; j < _jlen; j++) {
                var line = lines[j];

                var lineParts = line.split(/\s+/);
                var charactersToRemove = lineParts[2];

                var additionParts = lineParts[3].split("/");

                var charactersToAdd = additionParts[0];
                if (charactersToAdd === "0") charactersToAdd = "";

                var continuationClasses = this.parseRuleCodes(additionParts[1]);

                var regexToMatch = lineParts[4];

                var entry = {};
                entry.add = charactersToAdd;

                if (continuationClasses.length > 0) entry.continuationClasses = continuationClasses;

                if (regexToMatch !== ".") {
                    if (ruleType === "SFX") {
                        entry.match = new RegExp(regexToMatch + "$");
                    }
                    else {
                        entry.match = new RegExp("^" + regexToMatch);
                    }
                }

                if (charactersToRemove != "0") {
                    if (ruleType === "SFX") {
                        entry.remove = new RegExp(charactersToRemove  + "$");
                    }
                    else {
                        entry.remove = charactersToRemove;
                    }
                }

                entries.push(entry);
            }

            rules[ruleCode] = { "type" : ruleType, "combineable" : (combineable == "Y"), "entries" : entries };

            i += numEntries;
        }
        else if (ruleType === "COMPOUNDRULE") {
            var numEntries = parseInt(definitionParts[1], 10);

            for (var j = i + 1, _jlen = i + 1 + numEntries; j < _jlen; j++) {
                var line = lines[j];

                var lineParts = line.split(/\s+/);
                this.compoundRules.push(lineParts[1]);
            }

            i += numEntries;
        }
        else if (ruleType === "REP") {
            var lineParts = line.split(/\s+/);

            if (lineParts.length === 3) {
                this.replacementTable.push([ lineParts[1], lineParts[2] ]);
            }
        }
        else {
            // ONLYINCOMPOUND
            // COMPOUNDMIN
            // FLAG
            // KEEPCASE
            // NEEDAFFIX

            this.flags[ruleType] = definitionParts[1];
        }
    }

    return rules;
};

/**
 * Removes comment lines and then cleans up blank lines and trailing whitespace.
 *
 * @param {String} data The data from an affix file.
 * @return {String} The cleaned-up data.
 */
Dictionary.prototype._removeAffixComments = function (data) {
    // Remove comments
    data = data.replace(/#.*$/mg, "");

    // Trim each line
    data = data.replace(/^\s\s*/m, '').replace(/\s\s*$/m, '');

    // Remove blank lines.
    data = data.replace(/\n{2,}/g, "\n");

    // Trim the entire string
    data = data.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

    return data;
};

/**
 * Parses the words out from the .dic file.
 *
 * @param {String} data The data from the dictionary file.
 * @returns object The lookup table containing all of the words and
 *                 word forms from the dictionary.
 */
Dictionary.prototype._parseDIC = function (data) {
    data = this._removeDicComments(data);

    var lines = data.split("\n");
    var dictionaryTable = {};

    function addWord(word, rules) {
        // Some dictionaries will list the same word multiple times with different rule sets.
        if (!(word in dictionaryTable) || typeof dictionaryTable[word] != 'object') {
            dictionaryTable[word] = [];
        }

        dictionaryTable[word].push(rules);
    }

    // The first line is the number of words in the dictionary.
    for (var i = 1, _len = lines.length; i < _len; i++) {
        var line = lines[i];

        var parts = line.split("/", 2);

        var word = parts[0];

        // Now for each affix rule, generate that form of the word.
        if (parts.length > 1) {
            var ruleCodesArray = this.parseRuleCodes(parts[1]);

            // Save the ruleCodes for compound word situations.
            if (!("NEEDAFFIX" in this.flags) || ruleCodesArray.indexOf(this.flags.NEEDAFFIX) == -1) {
                addWord(word, ruleCodesArray);
            }

            for (var j = 0, _jlen = ruleCodesArray.length; j < _jlen; j++) {
                var code = ruleCodesArray[j];

                var rule = this.rules[code];

                if (rule) {
                    var newWords = this._applyRule(word, rule);

                    for (var ii = 0, _iilen = newWords.length; ii < _iilen; ii++) {
                        var newWord = newWords[ii];

                        addWord(newWord, []);

                        if (rule.combineable) {
                            for (var k = j + 1; k < _jlen; k++) {
                                var combineCode = ruleCodesArray[k];

                                var combineRule = this.rules[combineCode];

                                if (combineRule) {
                                    if (combineRule.combineable && (rule.type != combineRule.type)) {
                                        var otherNewWords = this._applyRule(newWord, combineRule);

                                        for (var iii = 0, _iiilen = otherNewWords.length; iii < _iiilen; iii++) {
                                            var otherNewWord = otherNewWords[iii];
                                            addWord(otherNewWord, []);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (code in this.compoundRuleCodes) {
                    this.compoundRuleCodes[code].push(word);
                }
            }
        }
        else {
            addWord(word.trim(), []);
        }
    }

    return dictionaryTable;
};


/**
 * Removes comment lines and then cleans up blank lines and trailing whitespace.
 *
 * @param {String} data The data from a .dic file.
 * @return {String} The cleaned-up data.
 */
Dictionary.prototype._removeDicComments = function (data) {
    // I can't find any official documentation on it, but at least the de_DE
    // dictionary uses tab-indented lines as comments.

    // Remove comments
    data = data.replace(/^\t.*$/mg, "");

    return data;

    // Trim each line
    data = data.replace(/^\s\s*/m, '').replace(/\s\s*$/m, '');

    // Remove blank lines.
    data = data.replace(/\n{2,}/g, "\n");

    // Trim the entire string
    data = data.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

    return data;
};

Dictionary.prototype.parseRuleCodes = function (textCodes) {
    if (!textCodes) {
        return [];
    }
    else if (!("FLAG" in this.flags)) {
        return textCodes.split("");
    }
    else if (this.flags.FLAG === "long") {
        var flags = [];

        for (var i = 0, _len = textCodes.length; i < _len; i += 2) {
            flags.push(textCodes.substr(i, 2));
        }

        return flags;
    }
    else if (this.flags.FLAG === "num") {
        return textCodes.split(",");
    }
};

/**
 * Applies an affix rule to a word.
 *
 * @param {String} word The base word.
 * @param {Object} rule The affix rule.
 * @returns {String[]} The new words generated by the rule.
 */

Dictionary.prototype._applyRule = function (word, rule) {
    var entries = rule.entries;
    var newWords = [];

    for (var i = 0, _len = entries.length; i < _len; i++) {
        var entry = entries[i];

        if (!entry.match || word.match(entry.match)) {
            var newWord = word;

            if (entry.remove) {
                newWord = newWord.replace(entry.remove, "");
            }

            if (rule.type === "SFX") {
                newWord = newWord + entry.add;
            }
            else {
                newWord = entry.add + newWord;
            }

            newWords.push(newWord);

            if ("continuationClasses" in entry) {
                for (var j = 0, _jlen = entry.continuationClasses.length; j < _jlen; j++) {
                    var continuationRule = this.rules[entry.continuationClasses[j]];

                    if (continuationRule) {
                        newWords = newWords.concat(this._applyRule(newWord, continuationRule));
                    }
                    /*
                    else {
                        // This shouldn't happen, but it does, at least in the de_DE dictionary.
                        // I think the author mistakenly supplied lower-case rule codes instead
                        // of upper-case.
                    }
                    */
                }
            }
        }
    }

    return newWords;
};


module.exports = Dictionary;

}).call(this,_dereq_("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},_dereq_("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/dictionary.js","/")
},{"buffer":4,"qC859L":6}],2:[function(_dereq_,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

var Dictionary = _dereq_("./dictionary");

var Spellchecker = function(dictionary) {
    this.dict = null;

    if (dictionary) this.use(dictionary);
};

// Use a parsed dictionary
Spellchecker.prototype.use = function(dictionary) {
    this.dict = new Dictionary(dictionary);
};

// Parse a dicitonary
Spellchecker.prototype.parse = function(dictionary) {
    var dict = new Dictionary();
    dict.parse(dictionary);

    this.use(dict);

    return dict.toJSON();
};

/**
 * Checks whether a word or a capitalization variant exists in the current dictionary.
 * The word is trimmed and several variations of capitalizations are checked.
 * If you want to check a word without any changes made to it, call checkExact()
 *
 * @see http://blog.stevenlevithan.com/archives/faster-trim-javascript re:trimming function
 *
 * @param {String} aWord The word to check.
 * @returns {Boolean}
 */

Spellchecker.prototype.check = function (aWord) {
    // Remove leading and trailing whitespace
    var trimmedWord = aWord.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

    if (this.checkExact(trimmedWord)) {
        return true;
    }

    // The exact word is not in the dictionary.
    if (trimmedWord.toUpperCase() === trimmedWord) {
        // The word was supplied in all uppercase.
        // Check for a capitalized form of the word.
        var capitalizedWord = trimmedWord[0] + trimmedWord.substring(1).toLowerCase();

        if (this.hasFlag(capitalizedWord, "KEEPCASE")) {
            // Capitalization variants are not allowed for this word.
            return false;
        }

        if (this.checkExact(capitalizedWord)) {
            return true;
        }
    }

    var lowercaseWord = trimmedWord.toLowerCase();

    if (lowercaseWord !== trimmedWord) {
        if (this.hasFlag(lowercaseWord, "KEEPCASE")) {
            // Capitalization variants are not allowed for this word.
            return false;
        }

        // Check for a lowercase form
        if (this.checkExact(lowercaseWord)) {
            return true;
        }
    }

    return false;
};

/**
 * Checks whether a word exists in the current dictionary.
 *
 * @param {String} word The word to check.
 * @returns {Boolean}
 */

Spellchecker.prototype.checkExact = function (word) {
    var ruleCodes = this.dict.dictionaryTable[word];

    if (typeof ruleCodes === 'undefined') {
        // Check if this might be a compound word.
        if ("COMPOUNDMIN" in this.dict.flags && word.length >= this.dict.flags.COMPOUNDMIN) {
            for (var i = 0, _len = this.dict.compoundRules.length; i < _len; i++) {
                if (word.match(this.dict.compoundRules[i])) {
                    return true;
                }
            }
        }

        return false;
    }
    else {
        for (var i = 0, _len = ruleCodes.length; i < _len; i++) {
            if (!this.hasFlag(word, "ONLYINCOMPOUND", ruleCodes[i])) {
                return true;
            }
        }

        return false;
    }
};

/**
 * Looks up whether a given word is flagged with a given flag.
 *
 * @param {String} word The word in question.
 * @param {String} flag The flag in question.
 * @return {Boolean}
 */

Spellchecker.prototype.hasFlag = function (word, flag, wordFlags) {
    if (flag in this.dict.flags) {
        if (typeof wordFlags === 'undefined') {
            var wordFlags = Array.prototype.concat.apply([], this.dict.dictionaryTable[word]);
        }

        if (wordFlags && wordFlags.indexOf(this.dict.flags[flag]) !== -1) {
            return true;
        }
    }

    return false;
};

/**
 * Returns a list of suggestions for a misspelled word.
 *
 * @see http://www.norvig.com/spell-correct.html for the basis of this suggestor.
 * This suggestor is primitive, but it works.
 *
 * @param {String} word The misspelling.
 * @param {Number} [limit=5] The maximum number of suggestions to return.
 * @returns {String[]} The array of suggestions.
 */

Spellchecker.prototype.suggest = function (word, limit) {
    if (!limit) limit = 5;

    if (this.check(word)) return [];

    // Check the replacement table.
    for (var i = 0, _len = this.dict.replacementTable.length; i < _len; i++) {
        var replacementEntry = this.dict.replacementTable[i];

        if (word.indexOf(replacementEntry[0]) !== -1) {
            var correctedWord = word.replace(replacementEntry[0], replacementEntry[1]);

            if (this.check(correctedWord)) {
                return [ correctedWord ];
            }
        }
    }

    var self = this;
    self.dict.alphabet = "abcdefghijklmnopqrstuvwxyz";

    /*
    if (!self.alphabet) {
        // Use the alphabet as implicitly defined by the words in the dictionary.
        var alphaHash = {};

        for (var i in self.dictionaryTable) {
            for (var j = 0, _len = i.length; j < _len; j++) {
                alphaHash[i[j]] = true;
            }
        }

        for (var i in alphaHash) {
            self.alphabet += i;
        }

        var alphaArray = self.alphabet.split("");
        alphaArray.sort();
        self.alphabet = alphaArray.join("");
    }
    */

    function edits1(words) {
        var rv = [];

        for (var ii = 0, _iilen = words.length; ii < _iilen; ii++) {
            var word = words[ii];

            var splits = [];

            for (var i = 0, _len = word.length + 1; i < _len; i++) {
                splits.push([ word.substring(0, i), word.substring(i, word.length) ]);
            }

            var deletes = [];

            for (var i = 0, _len = splits.length; i < _len; i++) {
                var s = splits[i];

                if (s[1]) {
                    deletes.push(s[0] + s[1].substring(1));
                }
            }

            var transposes = [];

            for (var i = 0, _len = splits.length; i < _len; i++) {
                var s = splits[i];

                if (s[1].length > 1) {
                    transposes.push(s[0] + s[1][1] + s[1][0] + s[1].substring(2));
                }
            }

            var replaces = [];

            for (var i = 0, _len = splits.length; i < _len; i++) {
                var s = splits[i];

                if (s[1]) {
                    for (var j = 0, _jlen = self.dict.alphabet.length; j < _jlen; j++) {
                        replaces.push(s[0] + self.dict.alphabet[j] + s[1].substring(1));
                    }
                }
            }

            var inserts = [];

            for (var i = 0, _len = splits.length; i < _len; i++) {
                var s = splits[i];

                if (s[1]) {
                    for (var j = 0, _jlen = self.dict.alphabet.length; j < _jlen; j++) {
                        replaces.push(s[0] + self.dict.alphabet[j] + s[1]);
                    }
                }
            }

            rv = rv.concat(deletes);
            rv = rv.concat(transposes);
            rv = rv.concat(replaces);
            rv = rv.concat(inserts);
        }

        return rv;
    }

    function known(words) {
        var rv = [];

        for (var i = 0; i < words.length; i++) {
            if (self.check(words[i])) {
                rv.push(words[i]);
            }
        }

        return rv;
    }

    function correct(word) {
        // Get the edit-distance-1 and edit-distance-2 forms of this word.
        var ed1 = edits1([word]);
        var ed2 = edits1(ed1);

        var corrections = known(ed1).concat(known(ed2));

        // Sort the edits based on how many different ways they were created.
        var weighted_corrections = {};

        for (var i = 0, _len = corrections.length; i < _len; i++) {
            if (!(corrections[i] in weighted_corrections)) {
                weighted_corrections[corrections[i]] = 1;
            }
            else {
                weighted_corrections[corrections[i]] += 1;
            }
        }

        var sorted_corrections = [];

        for (var i in weighted_corrections) {
            sorted_corrections.push([ i, weighted_corrections[i] ]);
        }

        function sorter(a, b) {
            if (a[1] < b[1]) {
                return -1;
            }

            return 1;
        }

        sorted_corrections.sort(sorter).reverse();

        var rv = [];

        for (var i = 0, _len = Math.min(limit, sorted_corrections.length); i < _len; i++) {
            if (!self.hasFlag(sorted_corrections[i][0], "NOSUGGEST")) {
                rv.push(sorted_corrections[i][0]);
            }
        }

        return rv;
    }

    return correct(word);
};

module.exports = Spellchecker;

}).call(this,_dereq_("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},_dereq_("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_6d11205c.js","/")
},{"./dictionary":1,"buffer":4,"qC859L":6}],3:[function(_dereq_,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,_dereq_("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},_dereq_("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\base64-js\\lib\\b64.js","/..\\node_modules\\base64-js\\lib")
},{"buffer":4,"qC859L":6}],4:[function(_dereq_,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = _dereq_('base64-js')
var ieee754 = _dereq_('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,_dereq_("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},_dereq_("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\buffer\\index.js","/..\\node_modules\\buffer")
},{"base64-js":3,"buffer":4,"ieee754":5,"qC859L":6}],5:[function(_dereq_,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,_dereq_("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},_dereq_("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\ieee754\\index.js","/..\\node_modules\\ieee754")
},{"buffer":4,"qC859L":6}],6:[function(_dereq_,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,_dereq_("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},_dereq_("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\process\\browser.js","/..\\node_modules\\process")
},{"buffer":4,"qC859L":6}]},{},[2])
(2)
});; })();