import express from 'express';
import {getClassesConfig, getEngineConfig, saveClassesConfig, saveTrainConfig} from '../database/engine.mjs';
import {getTrainingSet, setTrainingSet} from "../database/trainingset.mjs";
import {process} from "../preprocessing/train.mjs";
export const trainRouter = express.Router();

/* GET training set. */
trainRouter.get('/', async function (req, res, next) {
    let classes = await getClassesConfig();
    let configs = await getEngineConfig();
    let docs = await getTrainingSet('', configs);

    res.render('training-engine', { title: 'Training Engine', docs: docs, classes: classes, configs: configs});
});

trainRouter.post('/', async function (req, res, next) {
    let configs = await getEngineConfig();
    let docs = await getTrainingSet('', configs);
    let classes = Array.isArray(req.body.classes) ? req.body.classes : req.body.classes.split(" ");

    if (req.body.formBtn === 'save') {
        await saveClassesConfig(req.body.classes);
        await saveTrainConfig(req.body.limit, req.body.field, req.body.order);
        await setTrainingSet(classes, req.body.limit, req.body.field, req.body.order);
    }
    else if(req.body.formBtn === 'train') {
        await process();
        docs = await getTrainingSet('', configs);
    }

    classes = await getClassesConfig();

    res.render('training-engine', { title: 'Training Engine', docs: docs, classes: classes, configs: configs});
});