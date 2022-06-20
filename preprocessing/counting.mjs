import {ngram} from "./tokenization.mjs";
import {log} from "debug";

/**
 * @param {string} term
 * @param {string} text
 * @returns {boolean}
 */
export function exists(term, text) {
    return JSON.stringify(term) === JSON.stringify(text);
}
