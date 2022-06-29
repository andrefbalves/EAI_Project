import express from 'express';
import {getActiveClasses, getEngineConfig, saveTestConfig} from "../database/engine.mjs";
import {selectKBest} from "../database/terms.mjs";
export const testRouter = express.Router();

/* GET training set. */
testRouter.get('/', async function (req, res, next) {
    let configs = await getEngineConfig();
    let classes = await getActiveClasses();
    let bestTerms = await selectKBest('All','none', configs);

    res.render('test-engine', { title: 'Test Engine', terms: bestTerms, classes: classes, genre: 'All', configs: configs});
});

testRouter.post('/', async function (req, res, next) {

        await saveTestConfig(req.body.limitRecords, req.body.metric, req.body.operation, req.body.typeOfGram);
        let configs = await getEngineConfig();
        let classes = await getActiveClasses();
        let bestTerms = await selectKBest(req.body.genre, 'none', configs);

        res.render('test-engine', { title: 'Test Engine', terms: bestTerms, classes: classes,genre: req.body.genre, configs: configs});
});