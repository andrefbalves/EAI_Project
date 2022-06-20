import {getTrainingClasses, getTrainingSet} from "../database/trainingset.mjs";

async function process() {
    let classes = await getTrainingClasses();

    for (let i = 0; i < classes.length; i++) {
        let set = await getTrainingSet(classes[i].genre);
        let docSet = {docs: []};
        let bagOfUnigrams = [];
        let bagOfBigrams = [];

        for (let j = 0; j < set.length; j++) {
            docSet.docs[j] = preprocessing(set[j].id, set[j].description, 1);
            bagOfUnigrams = addUniqueTerms(bagOfUnigrams, docSet.docs[j].unigrams);
            docSet.docs[j].bigrams = preprocessing(set[j].id, set[j].description, 2).unigrams;
            bagOfBigrams = addUniqueTerms(bagOfBigrams, docSet.docs[j].bigrams);
        }

        docSet.bagOfUnigrams = bagOfUnigrams;
        docSet.bagOfBigrams = bagOfBigrams;
    }
}

console.log(process());