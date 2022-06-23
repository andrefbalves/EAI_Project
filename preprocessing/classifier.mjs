import {getTrainingClasses} from "../database/trainingset.mjs";
import {selectKBest} from "../database/terms.mjs";
import {preprocessing} from "./index.mjs";
import {tf, tfidf} from "./counting.mjs";

/**
 * @param {Array<{name, tfidf, idf}>} arrayOfTerms
 * @returns {*[]}
 */
function organizeClasses(arrayOfTerms) {
    let bagOfWords = [];

    for (let i = 0; i < arrayOfTerms.length; i++) {
        let obj = {};

        obj.name = arrayOfTerms[i].name.replace('`','');
        obj.tfidf = arrayOfTerms[i].tfidf;
        obj.idf = arrayOfTerms[i].idf;

        bagOfWords.push(obj);
    }
    return bagOfWords;
}

/**
 * @returns {Promise<*[]>}
 */
export async function classVectors() {
    let trainingClasses = await getTrainingClasses();
    let classes = [];

    for (let i = 0; i < trainingClasses.length; i++) {
        let obj = {genre: trainingClasses[i].genre, bagOfWords: []};

        obj.bagOfWords = await selectKBest(trainingClasses[i].genre, 0, '', 'average', '');
        classes.push(obj);
    }

    return classes;
}

/**
 * @param {Array<{tfidf}>} vectorA
 * @param {Array<{tfidf}>} vectorB
 * @returns {number}
 */
function calculateCosineSimilarity(vectorA, vectorB) {//todo vector A e B não estão com a mesma dimensão
    let axb= 0;
    let aSquare = 0;
    let bSquare = 0;

    for (let i = 0; i < vectorA.length; i++) {
        axb += vectorA[i].tfidf *  vectorB[i].tfidf;
        aSquare += vectorA[i].tfidf *  vectorA[i].tfidf;
        bSquare += vectorB[i].tfidf *  vectorB[i].tfidf;
    }
    aSquare = Math.sqrt(aSquare);
    bSquare = Math.sqrt(bSquare);

    let result = axb / (aSquare * bSquare);

    return Number.isNaN(result) ? 0 : result;
}

/**
 * @param {string} text
 * @returns {Promise<void>}
 */
async function cosineSimilarity(text) {//todo vector A e B não estão com a mesma dimensão
    let classes = await classVectors();
    let doc;
    let arrayOfTerms = [];
    let similarityClasses = [];
    let maxSimilarity = {genre: '', classSimilarity: 0};

    doc = preprocessing('', text);
    arrayOfTerms = doc.unigrams.concat(doc.bigrams);

    for (let i = 0; i < classes.length; i++) {
        let terms = [];
        let obj = {genre: classes[i].genre, classSimilarity: 0};

        for (let j = 0; j < classes[i].bagOfWords.length; j++) {
            let term = {};

            term.name = classes[i].bagOfWords[j].name;
            term.tfidf = tfidf(tf(classes[i].bagOfWords[j].name.split(' '), arrayOfTerms), classes[i].bagOfWords[j].idf);

            terms.push(term);
        }

        obj.classSimilarity = calculateCosineSimilarity(classes[i].bagOfWords, terms);
        similarityClasses.push(obj);
    }

    for (let i = 0; i< similarityClasses.length; i++) {
        if (maxSimilarity.classSimilarity < similarityClasses[i].classSimilarity)
            maxSimilarity = similarityClasses[i];
    }

    return console.log({label: maxSimilarity.genre, similarity: maxSimilarity.classSimilarity});
}
console.log(cosineSimilarity("this is a text woman"));