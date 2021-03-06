import {getTrainingSet} from "../database/trainingset.mjs";
import {preprocessing} from "./index.mjs";
import {addUniqueTerms, buildVector, operateVector} from "../features/bagOfWords.mjs";
import {cleanTemplate, cleanTerms, saveTerms} from "../database/terms.mjs";
import {getActiveClasses, getEngineConfig} from "../database/engine.mjs";
import fs from "fs";
import {cleanResults} from "../database/results.mjs";
import {cleanTestingSet} from "../database/testingset.mjs";

/**
 * @param {Array<{unigrams: [], bigrams: []}>} docs
 * @param {Array<string>} bagOfUnigrams
 * @param {Array<string>} bagOfBigrams
 * @returns {Array<{uniTerms: [], biTerms: []}>}
 */
function buildTerms(docs, bagOfUnigrams, bagOfBigrams) {
    let docTerms = [];
    docTerms = docTerms.concat(docs);

    for (let i = 0; i < docs.length; i++) {
        docTerms[i].uniTerms = buildVector(bagOfUnigrams, docs[i].unigrams, docs.length);
        docTerms[i].biTerms = buildVector(bagOfBigrams, docs[i].bigrams, docs.length);
    }
    return docTerms;
}

/**
 * @param {Array<{name: string, uniTerms: [], biTerms: []}>} docs
 * @param {Array} bagOfGrams
 * @param {number} n
 * @returns {Array<string>}
 */
function calculateTerms(docs, bagOfGrams, n) {
    let bagOfWords = [];

    for (let i = 0; i < bagOfGrams.length; i++) {
        let sameTerms = [];
        let obj = {};
        obj.name = bagOfGrams[i].join(' ');

        for (let j = 0; j < docs.length; j++) {
            if(n === 1)
                sameTerms.push(docs[j].uniTerms.filter(doc => doc.name === obj.name));
            else
                sameTerms.push(docs[j].biTerms.filter(doc => doc.name === obj.name));
        }
        obj.sum = operateVector(sameTerms,'sum',docs.length);
        obj.average = operateVector(sameTerms,'average',docs.length);

        bagOfWords.push(obj);
    }

    return bagOfWords;
}

/**
 * @param {Array<{class, docs, bagOfUnigrams, bagOfBigrams}>} trainingSet
 * @returns {Promise<void>}
 */
async function save(trainingSet) {

    await cleanTerms();
    await cleanResults();
    await cleanTestingSet();

    for (let i = 0; i < trainingSet.length; i++) {
        await saveTerms(trainingSet[i]);
    }

    await cleanTemplate();

    saveFile(trainingSet);
}

/**
 *
 * @param {Array<{class, docs, bagOfUnigrams, bagOfBigrams}>} trainingSet
 */
function saveFile(trainingSet) {
    let obj = {
        trainingSet: []
    };

    for (let i = 0; i < trainingSet.length; i++) {
        obj.trainingSet.push(trainingSet[i]);
    }

    let json = JSON.stringify(obj);

    try {
        fs.writeFileSync('./trainingSet.json', json);
    } catch (err) {
        console.error(err)
    }
}

/**
 * @returns {Promise<void>}
 */
export async function process() {
    let configs = await getEngineConfig();
    let classes = await getActiveClasses();
    let train = [];

    for (let i = 0; i < classes.length; i++) {
        let set = await getTrainingSet(classes[i].genre, configs);
        let docSet = {class: classes[i].genre, docs: []};
        let bagOfUnigrams = [];
        let bagOfBigrams = [];

        for (let j = 0; j < set.length; j++) {
            docSet.docs[j] = preprocessing(set[j].id, set[j].overview);
            bagOfUnigrams = addUniqueTerms(bagOfUnigrams, docSet.docs[j].unigrams);
            bagOfBigrams = addUniqueTerms(bagOfBigrams, docSet.docs[j].bigrams);
        }

        docSet.bagOfUnigrams = bagOfUnigrams;
        docSet.bagOfBigrams = bagOfBigrams;

        docSet.docs = buildTerms(docSet.docs, docSet.bagOfUnigrams, docSet.bagOfBigrams);
        docSet.bagOfUnigrams = calculateTerms(docSet.docs, docSet.bagOfUnigrams, 1);
        docSet.bagOfBigrams = calculateTerms(docSet.docs, docSet.bagOfBigrams, 2);

        train.push(docSet);
    }

    await save(train);
    console.log('Completed');
}
//console.log(process());