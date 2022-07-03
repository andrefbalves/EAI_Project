import express from 'express';
import {getActiveClasses, getClassesConfig, getEngineConfig, saveTestConfig} from '../database/engine.mjs';
import {setTestingSet, getTestingSet} from "../database/testingset.mjs";
import {testEngine} from "../preprocessing/stats.mjs";
import {cleanResults} from "../database/results.mjs";
export const testRouter = express.Router();

/* GET training set. */
testRouter.get('/', async function (req, res, next) {

    let classes = await getClassesConfig();
    let configs = await getEngineConfig();
    let docs = await getTestingSet('', configs);

    res.render('test-engine', { title: 'Test Engine', docs: docs, classes: classes, configs: configs});
});

testRouter.post('/', async function (req, res, next) {
    let configs = await getEngineConfig();
    let classes = await getClassesConfig();
    let activeClasses = await getActiveClasses();
    let docs = [];

    if (req.body.formBtn === 'save') {
        await saveTestConfig(req.body.limit, req.body.field, req.body.order);
        await setTestingSet(activeClasses, req.body.limit, req.body.field, req.body.order, configs);
        await cleanResults();
    }else if (req.body.formBtn === 'test') {
        await testEngine();
    }

    docs = await getTestingSet(configs);

    res.render('test-engine', { title: 'Test Engine', docs: docs, classes: classes, configs: configs});
});