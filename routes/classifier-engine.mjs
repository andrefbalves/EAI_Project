import express from 'express';
import {getStats} from "../preprocessing/stats.mjs";
import {getClassesConfig, getEngineConfig, saveSelectionConfig} from "../database/engine.mjs";
import {selectKBest} from "../database/terms.mjs";
import {configurationRouter} from "./configuration-engine.mjs";
import {classifyCosineSimilarity, classifyNaiveBayes} from "../preprocessing/classifier.mjs";
import {saveResults} from "../database/results.mjs";

export const classifierRouter = express.Router();

classifierRouter.get('/', async function (req, res, next) {//todo bloquear botão de correr classificador com base a existência de termos (train)
    let configs = await getEngineConfig();
    let classes = await getClassesConfig();
    let cosineStats = await getStats('cosine');
    let cosineError = cosineStats === -1;
    let bayesStats = await getStats('bayes');
    let bayesError = bayesStats === -1;
    let terms = await selectKBest('', configs);
    let readyToClassify = terms.length > 0;

    res.render('classifier-engine', {
        title: 'Classifier Engine',
        classes: classes,
        readyToClassify: readyToClassify,
        doc: '',
        docCosine: undefined,
        docBayes: undefined,
        realClass: undefined,
        cosineStats: !cosineError ? cosineStats : undefined,
        bayesStats: !bayesError ? bayesStats : undefined
    });
});

classifierRouter.post('/', async function (req, res, next) {
    let classes = await getClassesConfig();
    let docCosine = await classifyCosineSimilarity(req.body.doc);
    let docBayes = await classifyNaiveBayes(req.body.doc);

    if (req.body.formBtn === 'save') {
        //todo adicionar ao TEST set para servir de exemplo como teste?
        await saveResults([{
            doc: req.body.doc,
            cosineClass: {genre: docCosine.genre},
            bayesClass: {genre: docBayes.genre},
            realClass: req.body.realClass,
            protected: 1
        }]);
    }

    let cosineStats = await getStats('cosine');
    let cosineError = new Error(cosineStats);
    cosineError = cosineError instanceof Error;
    let bayesStats = await getStats('bayes');
    let bayesError = new Error(bayesStats);
    bayesError = bayesError instanceof Error;

    res.render('classifier-engine', {
        title: 'Classifier Engine',
        readyToClassify: true,
        classes: classes,
        doc: req.body.doc,
        docCosine: req.body.formBtn === 'save' ? undefined : docCosine.genre,
        docBayes: req.body.formBtn === 'save' ? undefined : docBayes.genre,
        realClass: req.body.realClass,
        cosineStats: !cosineError ? cosineStats : undefined,
        bayesStats: !bayesError ? bayesStats : undefined
    });
});