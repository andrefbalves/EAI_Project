import {getResults} from "../database/results.mjs";
import ConfusionMatrix from "ml-confusion-matrix";

/**
 * @returns {Promise<ConfusionMatrix>}
 */
async function getConfusionMatrix() {
    let results = await getResults();

    let realClasses = results.map(a => a.real_class);
    let predictedClasses = results.map(a => a.predicted_class);

    return ConfusionMatrix.fromLabels(realClasses, predictedClasses);
}

/**
 * @returns {Promise<{fScore: number, confusionMatrix: ConfusionMatrix, precision: number, recall: number}>}
 */
export async function getStats() {
    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;

    let confusionMatrix = await getConfusionMatrix();

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

    return {confusionMatrix, precision, recall, fScore};
}

