import express from 'express';
import {getStats} from "../preprocessing/stats.mjs";
import {getClassesConfig} from "../database/engine.mjs";

export const classifierRouter = express.Router();

/* GET training set. */
classifierRouter.get('/', async function (req, res, next) {
    let classes = await getClassesConfig();
    let cosineStats = await getStats('cosine');
    let bayesStats = await getStats('bayes');
    let realClasse = req.body.realClass;

    res.render('classifier-engine', {
        title: 'Classifier Engine',
        classes: classes,
        realClasse: realClasse,
        cosineStats: cosineStats,
        bayesStats: bayesStats
    });
});