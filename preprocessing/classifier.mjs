import {selectKBest} from "../database/terms.mjs";
import {preprocessing} from "./index.mjs";
import {tf, tfidf} from "./counting.mjs";
import {getEngineConfig, getActiveClasses} from "../database/engine.mjs";
import {getTrainingSet} from "../database/trainingset.mjs";

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
async function classVectors() {
    let activeClasses = await getActiveClasses();
    let classes = [];

    for (let i = 0; i < activeClasses.length; i++) {
        let obj = {genre: activeClasses[i].genre, bagOfWords: []};

        obj.bagOfWords = organizeClasses(await selectKBest(activeClasses[i].genre, await getEngineConfig()));
        classes.push(obj);
    }

    return classes;
}

/**
 * @param {Array<{tfidf}>} vectorA
 * @param {Array<{tfidf}>} vectorB
 * @returns {number}
 */
function calculateCosineSimilarity(vectorA, vectorB) {
    let axb= 0;
    let aSquare = 0;
    let bSquare = 0;

    for (let i = 0; i < vectorA.length; i++) {
        axb += vectorA[i].tfidf *  vectorB[i].tfidf;
        aSquare += vectorA[i].tfidf *  vectorA[i].tfidf;
        bSquare += vectorB[i].tfidf *  vectorB[i].tfidf;
    }

    let result = axb / (Math.sqrt(aSquare) * Math.sqrt(bSquare));

    return Number.isNaN(result) ? 0 : result;
}

/**
 * @param {string} overview
 * @returns {Promise<{genre: string, classSimilarity: number}>}
 */
async function cosineSimilarity(overview) {
    let classes = await classVectors();
    let doc;
    let arrayOfTerms = [];
    let similarityClasses = [];
    let maxSimilarity = {genre: '', classSimilarity: 0};

    doc = preprocessing('', overview);
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

    return maxSimilarity;
}

/**
 * @param {string} genre
 * @param {{train_order_by_field: string, train_order_by: string}} configs
 * @returns {Promise<number>}
 */
async function calculateProbability(genre, configs) {
    let genreRecords = await getTrainingSet(genre, configs);
    let allRecords = await getTrainingSet('', configs);

    return genreRecords.length / allRecords.length;
}

/**
 * @param {string} overview
 */
function classify(overview) {
    //todo LAB 7
}
//console.log(cosineSimilarity("this is a text woman"));
