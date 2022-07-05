import express from 'express';
import {getStats} from "../preprocessing/stats.mjs";
import {getActiveClasses, getClassesConfig, getEngineConfig} from "../database/engine.mjs";
import {selectKBest} from "../database/terms.mjs";
import {classifyCosineSimilarity, classifyNaiveBayes} from "../preprocessing/classifier.mjs";
import {saveResults} from "../database/results.mjs";

export const classifierRouter = express.Router();

classifierRouter.get('/', async function (req, res, next) {
    let configs = await getEngineConfig();
    let classes = await getClassesConfig();
    let cosineStats = await getStats('cosine');
    let cosineError = cosineStats === -1;
    let bayesStats = await getStats('bayes');
    let bayesError = bayesStats === -1;
    let activeClasses = await getActiveClasses();
    let terms = [];

    for (let i = 0; i < activeClasses.length; i++) {
        let resp = await selectKBest(activeClasses[i].genre, configs);
        terms = terms.concat(resp);
    }

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
        await saveResults([{
            doc: req.body.doc,
            cosineClass: {genre: docCosine.genre},
            bayesClass: {genre: docBayes.genre},
            realClass: req.body.realClass,
            protected: 1
        }]);
    }

    let cosineStats = await getStats('cosine');
    let cosineError = cosineStats === -1;
    let bayesStats = await getStats('bayes');
    let bayesError = bayesStats === -1;

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