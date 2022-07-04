import express from 'express';
import {getActiveClasses, getClassesConfig, getEngineConfig, saveSelectionConfig} from "../database/engine.mjs";
import {selectKBest} from "../database/terms.mjs";

export const configurationRouter = express.Router();

/* GET training set. */
configurationRouter.get('/', async function (req, res, next) {
    let configs = await getEngineConfig();
    let classes = await getClassesConfig();
    let activeClasses = await getActiveClasses();
    let terms = [];

    for (let i = 0; i < activeClasses.length; i++) {
        let resp = await selectKBest(activeClasses[i].genre, configs);
        terms = terms.concat(resp);
    }

    let readyToClassify = terms.length > 0;

    res.render('configuration-engine', {
        title: 'Configuration Engine',
        readyToClassify: readyToClassify,
        saved: false,
        terms: terms,
        classes: classes,
        configs: configs
    });
});

configurationRouter.post('/', async function (req, res, next) {

    await saveSelectionConfig(req.body.limitRecords, req.body.metric, req.body.operation, req.body.typeOfGram, req.body.testNormalizer);
    let configs = await getEngineConfig();
    let classes = await getClassesConfig();
    let activeClasses = await getActiveClasses();
    let terms = [];

    for (let i = 0; i < activeClasses.length; i++) {
        let resp = await selectKBest(activeClasses[i].genre, configs);
        terms = terms.concat(resp);
    }

    res.render('configuration-engine', {
        title: 'Configuration Engine',
        readyToClassify: true,
        saved: true,
        terms: terms,
        classes: classes,
        configs: configs
    });
});