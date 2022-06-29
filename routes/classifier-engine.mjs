import express from 'express';
import {getClassesConfig, getEngineConfig, saveClassesConfig, saveTrainConfig} from '../database/engine.mjs';
import {getTrainingSet, setTrainingSet} from "../database/trainingset.mjs";
import {process} from "../preprocessing/train.mjs";
export const classifierRouter = express.Router();

/* GET training set. */
classifierRouter.get('/', async function (req, res, next) {

    res.render('classifier-engine', { title: 'Classifier Engine'});
});