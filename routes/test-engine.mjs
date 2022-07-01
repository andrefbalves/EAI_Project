import express from 'express';
import {getClassesConfig, getEngineConfig, saveClassesConfig, saveTrainConfig} from '../database/engine.mjs';
import {getTrainingSet, setTrainingSet} from "../database/trainingset.mjs";
import {process} from "../preprocessing/train.mjs";

export const testRouter = express.Router();

/* GET training set. */
testRouter.get('/', async function (req, res, next) {
    let classes = await getClassesConfig();
    let configs = await getEngineConfig();
    let docs = await getTrainingSet('', configs);

    res.render('test-engine', {title: 'Test Engine', docs: docs, classes: classes, configs: configs});
});

testRouter.post('/', async function (req, res, next) {
    let configs = await getEngineConfig();
    let classes = Array.isArray(req.body.classes) ? req.body.classes : req.body.classes.split(" ");

    if (req.body.formBtn === 'save') {
        await saveClassesConfig(req.body.classes);
        await saveTrainConfig(req.body.limit, req.body.field, req.body.order);
        await setTrainingSet(classes, req.body.limit, req.body.field, req.body.order);
    } else if (req.body.formBtn === 'train') {
        await process();
    }

    configs = await getEngineConfig();
    let docs = await getTrainingSet('', configs);

    classes = await getClassesConfig();

    res.render('test-engine', {title: 'Test Engine', docs: docs, classes: classes, configs: configs});
});