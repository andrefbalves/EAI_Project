import {stemmer} from 'stemmer';

/**
 * @param {string} cleanedText
 * @returns {Array.<string>}
 */
export function stemm(cleanedText) {
    let words = cleanedText.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = stemmer(words[i]);
    }

    return words;
}

//console.log(stemm(6,'a really Interesting string with some words'));