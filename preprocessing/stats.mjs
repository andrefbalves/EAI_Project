import {getResults, saveResults} from "../database/results.mjs";
import ConfusionMatrix from "ml-confusion-matrix";
import {getTestingSet} from "../database/testingset.mjs";
import {classifyCosineSimilarity, classifyNaiveBayes} from "./classifier.mjs";

/**
 * @param {string} classifier cosine or bayes
 * @returns {Promise<ConfusionMatrix>}
 */
async function getConfusionMatrix(classifier) {
    let results = await getResults();

    let realClasses = results.map(a => a.real_class);
    let predictedClasses = results.map(a => (classifier === 'cosine' ? a.cosine_class : a.bayes_class));

    return ConfusionMatrix.fromLabels(realClasses, predictedClasses);
}

/**
 * @param {ConfusionMatrix} confusionMatrix
 * @returns {{genres, matrix: *[]}}
 */
function transposeMatrix(confusionMatrix) {
    let confusionMatrixTable = {genres: confusionMatrix.labels, matrix: []};

    confusionMatrixTable.matrix = confusionMatrix.matrix[0].map((_, colIndex) => confusionMatrix.matrix.map(row => row[colIndex]));

    return  confusionMatrixTable;
}

/**
 * @param {string} classifier cosine or bayes
 * @returns {Promise<{fScore: number, confusionMatrix: {genres, matrix: *[]}, precision: number, recall: number}>}
 */
export async function getStats(classifier) {
    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;

    let confusionMatrix = await getConfusionMatrix(classifier);

    if(confusionMatrix.labels.length === 2) {
        truePositives = confusionMatrix.matrix[0][0];
        falsePositives = confusionMatrix.matrix[1][0];
        falseNegatives = confusionMatrix.matrix[0][1];
    }
    else {
        for (let i = 0; i < confusionMatrix.labels.length; i++) {
            truePositives += confusionMatrix.getTruePositiveCount(confusionMatrix.labels[i]);
            falsePositives += confusionMatrix.getFalsePositiveCount(confusionMatrix.labels[i]);
            falseNegatives += confusionMatrix.getFalseNegativeCount(confusionMatrix.labels[i]);
        }
    }

    let precision = truePositives / (truePositives + falsePositives);
    let recall = truePositives / (truePositives + falseNegatives);
    let fScore = 2 * (precision * recall) / (precision + recall);

    confusionMatrix = transposeMatrix(confusionMatrix);

    return {confusionMatrix, precision, recall, fScore};
}

/**
 * @returns {Promise<void>}
 */
export async function testEngine() {
    let docs = await getTestingSet();
    let results = [];

    for (let i = 0; i < docs.length; i++) {
        let obj = {doc: '', cosineClass: '', bayesClass: '', realClass: ''};

        obj.doc = docs[i].overview;
        obj.realClass = docs[i].genre;
        obj.cosineClass = await classifyCosineSimilarity(docs[i].overview);
        obj.bayesClass = await classifyNaiveBayes(docs[i].overview);

        results.push(obj);
    }

    await saveResults(results);
}