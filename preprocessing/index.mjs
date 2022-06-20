import {cleanText} from "./clean.mjs";
import {stemm} from "./stemming.mjs";
import {ngram} from "./tokenization.mjs";
import {cleanStopwords} from "./stopwords.mjs";

/**
 * @param {string} docId
 * @param {string} docText
 * @param {number} n 1-unigram or 2-bigram
 * @returns {{}}
 */
export function preprocessing(docId, docText, n) {

    let result = {};

    result.id  = docId;
    result.originalText = docText;
    result.cleanedText = cleanText(cleanStopwords(docText).join(' '));
    result.stemmedText = stemm(result.cleanedText).join(' ');//todo testar se este join é necessário dado que depois faço split lá dentro
    result.unigrams = ngram(n, result.stemmedText.split(' '));

    return result;
}

//console.log(preprocessing('a really Interesting string with some words', 2));