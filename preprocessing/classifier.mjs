import {selectKBest} from "../database/terms.mjs";
import {preprocessing} from "./index.mjs";
import {exists, idf, tf, tfidf} from "./counting.mjs";
import {getEngineConfig, getActiveClasses} from "../database/engine.mjs";
import {getTrainingSet} from "../database/trainingset.mjs";
import {addUniqueTerms} from "../features/bagOfWords.mjs";

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
    let classes = await classVectors();//todo criar campo para selecionar metodo avg para o cosineSimilarity
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
 * @param {number} numberOfClassRecords
 * @param {{train_order_by_field: string, train_order_by: string}} configs
 * @returns {Promise<number>}
 */
async function classProbability(numberOfClassRecords, configs) {
    let allRecords = await getTrainingSet('', configs);

    return numberOfClassRecords / allRecords.length;
}

/**
 * @param {{occurrences: number, binary: number, tf: number, idf: number, tf_idf: number}} term
 * @param {number} numberOfDocs
 */
function laplaceCorrection(terms, numberOfDocs) {
    for (let i = 0; i < terms.length; i++) {
        terms[i].occurrences += 1;
        terms[i].binary += 1;
        terms[i].tf = terms[i].occurrences / terms.length;
        terms[i].idf = idf(numberOfDocs, terms[i].binary);
        terms[i].tf_idf = tfidf(terms[i].tf, terms[i].idf);
    }
    return terms;
}

/**
 * @param {Array<{occurrences}>} arrayOfTerms
 * @param {number} denominator
 * @returns {number}
 */
function termProbability(arrayOfTerms, denominator) {
    let termsProbability = 1;

    for (let i = 0; i < arrayOfTerms.length;i++) {
        termsProbability *= arrayOfTerms[i].occurrences / denominator;//todo adicionar normalizer À BD para usar aqui
    }
    return termsProbability;
}

/**
 * @param {string} overview
 */
async function classify(overview) {
    let configs = await getEngineConfig();
    let classes = await classVectors();//todo criar campo para selecionar metodo sum para NaiveBayes
    let uniqueTerms = [];
    let doc;
    let arrayOfTerms = [];
    let classesBayes = [];
    let maxBayes = {genre: '', classBayes: 0};

    doc = preprocessing('', overview);
    arrayOfTerms = doc.unigrams.concat(doc.bigrams);

    for (let i = 0; i < classes.length; i++) {
        let classRecords = await getTrainingSet(classes[i].genre, configs);

        for (let j = 0; j < classes[i].bagOfWords; j++) {
            classes[i].bagOfWords[j] = laplaceCorrection(classes[i].bagOfWords[j], classRecords.length);
            uniqueTerms = addUniqueTerms(uniqueTerms, classes[i].bagOfWords[j]);
        }
    }

    for (let i = 0; i < classes.length; i++) {
        let classRecords = await getTrainingSet(classes[i].genre, configs);
        let termsOfClass = [];
        let obj = {genre: classes[i].genre, classBayes: 0};

        for (let j = 0; j < arrayOfTerms.length; j++) {
            for (let k = 0; k < classes[i].bagOfWords.length; k++){
                if (exists(classes[i].bagOfWords[k], arrayOfTerms[j]))
                    termsOfClass.push(arrayOfTerms[j]);
                else
                    termsOfClass.push(laplaceCorrection(arrayOfTerms[j], classRecords.length));//todo adicionar o numero de docs
            }
        }

        let termProbability = termProbability(termsOfClass, classes[i].bagOfWords.length + uniqueTerms.length);

        obj.classBayes = await classProbability(classRecords.length, configs) * termProbability;

        classesBayes.push(obj);
    }

    for (let i = 0; i < classesBayes.length; i++) {
        if (maxBayes.classBayes < classesBayes[i].classBayes)
            maxBayes = classesBayes[i];
    }

    return maxBayes;
}//todo testar
//console.log(cosineSimilarity("this is a text woman"));
