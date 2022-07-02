import express from 'express';
import {getStats} from "../preprocessing/stats.mjs";

export const classifierRouter = express.Router();

/* GET training set. */
classifierRouter.get('/', async function (req, res, next) {
    let stats = await getStats();

    res.render('classifier-engine', {
        title: 'Classifier Engine',
        confusionMatrix: stats.confusionMatrix,
        precision: stats.precision,
        recall: stats.recall,
        fScore: stats.fScore
    });
});