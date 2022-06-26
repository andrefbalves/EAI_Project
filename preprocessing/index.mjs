import {cleanText} from "./clean.mjs";
import {stemm} from "./stemming.mjs";
import {ngram} from "./tokenization.mjs";
import {cleanStopwords} from "./stopwords.mjs";

/**
 * @param {string} docId
 * @param {string} docText
 * @returns {id: string, originalText: string, cleanedText: string, stemmedText: string, unigrams: Array<string>, bigrams: Array<string>}
 */
export function preprocessing(docId, docText) {//todo docId está como undifined

    let doc = {};

    doc.id  = docId;
    doc.originalText = docText;
    doc.cleanedText = cleanText(cleanStopwords(docText).join(' '));
    doc.stemmedText = stemm(doc.cleanedText).join(' ');
    doc.unigrams = ngram(1, doc.stemmedText.split(' '));
    doc.bigrams = ngram(2, doc.stemmedText.split(' '));

    return doc;
}