import express from 'express';
import {getClassesConfig, getEngineConfig, saveTestConfig} from '../database/engine.mjs';
import {setTestingSet, getTestingSet} from "../database/testingset.mjs";
export const testRouter = express.Router();

/* GET training set. */
testRouter.get('/', async function (req, res, next) {

    let classes = await getClassesConfig();
    let configs = await getEngineConfig();
    let docs = await getTestingSet('', configs);

    res.render('test-engine', { title: 'Test Engine', docs: docs, classes: classes, configs: configs});
});

testRouter.post('/', async function (req, res, next) {
    let classes = await getClassesConfig();

    if (req.body.formBtn === 'save') {

        await saveTestConfig(req.body.limit, req.body.field, req.body.order);

    }

    let configs = await getEngineConfig();

    if (req.body.formBtn === 'test') {

        await setTestingSet(classes, req.body.limit, req.body.field, req.body.order, configs)
    }
    let docs = await getTestingSet('', configs);

    res.render('test-engine', { title: 'Test Engine', docs: docs, classes: classes, configs: configs});
});