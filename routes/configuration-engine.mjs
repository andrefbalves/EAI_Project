import express from 'express';
import {getClassesConfig, getEngineConfig, saveSelectionConfig} from "../database/engine.mjs";
import {selectKBest} from "../database/terms.mjs";

export const configurationRouter = express.Router();

/* GET training set. */
configurationRouter.get('/', async function (req, res, next) {
    let configs = await getEngineConfig();
    let classes = await getClassesConfig();
    let bestTerms = await selectKBest('All', configs);
    let readyToClassify = bestTerms.length > 0;

    res.render('configuration-engine', {
        title: 'Configuration Engine',
        readyToClassify: readyToClassify,
        saved: false,
        terms: bestTerms,
        classes: classes,
        configs: configs
    });
});

configurationRouter.post('/', async function (req, res, next) {

    await saveSelectionConfig(req.body.limitRecords, req.body.metric, req.body.operation, req.body.typeOfGram, req.body.testNormalizer);
    let configs = await getEngineConfig();
    let classes = await getClassesConfig();
    let bestTerms = await selectKBest('All', configs);

    res.render('configuration-engine', {
        title: 'Configuration Engine',
        readyToClassify: true,
        saved: true,
        terms: bestTerms,
        classes: classes,
        configs: configs
    });
});