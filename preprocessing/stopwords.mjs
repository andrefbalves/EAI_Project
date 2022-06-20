import { removeStopwords, eng } from 'stopword';

/**
 * 
 * @param docText
 * @returns {string}
 */
export function cleanStopwords(docText) {
    return removeStopwords(docText.split(' '));
}

//console.log(cleanStopwords('a really Interesting string with some words'))