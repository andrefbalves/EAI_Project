import express from 'express';
import {getStats} from "../preprocessing/stats.mjs";
import {getClassesConfig, getEngineConfig, saveSelectionConfig} from "../database/engine.mjs";
import {selectKBest} from "../database/terms.mjs";
import {configurationRouter} from "./configuration-engine.mjs";
import {classifyCosineSimilarity, classifyNaiveBayes} from "../preprocessing/classifier.mjs";
import {saveResults} from "../database/results.mjs";

export const classifierRouter = express.Router();

classifierRouter.get('/', async function (req, res, next) {
    let classes = await getClassesConfig();
    let cosineStats = await getStats('cosine');
    let bayesStats = await getStats('bayes');
    let realClass = req.body.realClass;

    res.render('classifier-engine', {
        title: 'Classifier Engine',
        classes: classes,
        doc: '',
        docCosine: undefined,
        docBayes: undefined,
        realClass: realClass,
        cosineStats: cosineStats,
        bayesStats: bayesStats
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
    let bayesStats = await getStats('bayes');

    res.render('classifier-engine', {
        title: 'Classifier Engine',
        classes: classes,
        doc: req.body.doc,
        docCosine: req.body.formBtn === 'save' ? undefined : docCosine.genre,
        docBayes: req.body.formBtn === 'save' ? undefined : docBayes.genre,
        realClass: req.body.realClass,
        cosineStats: cosineStats,
        bayesStats: bayesStats
    });
});
//todo testar