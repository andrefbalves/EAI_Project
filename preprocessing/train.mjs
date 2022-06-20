import {getTrainingClasses, getTrainingSet} from "../database/trainingset.mjs";
import {preprocessing} from "./index.mjs";
import {addUniqueTerms} from "../features/bagOfWords.mjs";

/**
 * @param docs
 * @param bagOfUnigrams
 * @param bagOfBigrams
 * @returns {*}
 */
function buildTerms(docs, bagOfUnigrams, bagOfBigrams) {
//todo
    for (let i = 0; i < docs.length; i++) {
        docs[i].uniTerms = buildVector(bagOfUnigrams, docs[i].unigrams);
        docs[i].biTerms = buildVector(bagOfBigrams, docs[i].bigrams);
    }
    return docs;
}

async function process() {
    let classes = await getTrainingClasses();

    for (let i = 0; i < classes.length; i++) {
        let set = await getTrainingSet(classes[i].genre);
        let docSet = {docs: []};
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
    }
}

console.log(process());