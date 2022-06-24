import { nGram } from 'n-gram';

/**
 * @param {number} n 1-unigram or 2-bigram
 * @param {Array<string>} text
 * @returns {Array<string>[]}
 */
export function ngram(n, text) {
    return nGram(n)(text);
}

console.log(ngram(4,'a really Interesting string with some words'.split(" ")));