import { removeStopwords, eng } from 'stopword';

/**
 * 
 * @param {string} docText
 * @returns {Array<string>}
 */
export function cleanStopwords(docText) {
    return removeStopwords(docText.split(' '));
}