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
    if (req.body.formBtn === 'save') {
        await saveClassesConfig(req.body.classes);
        await saveTrainConfig(req.body.limit, req.body.field, req.body.order);
    }
    else if(req.body.formBtn === 'train') {
        await process();
    }

    let classes = await getClassesConfig();
    let configs = await getEngineConfig();

    if (req.body.formBtn === 'save') {
        await setTrainingSet(classes.filter(c => c.active === 1), configs);
    }

    let docs = await getTrainingSet('', configs);

    res.render('training-engine', { title: 'Training Engine', docs: docs, classes: classes, configs: configs});
});