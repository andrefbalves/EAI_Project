const express = require('express');
const router = express.Router();
const engine = require('../database/engine');
const trainingSet = require('../database/trainingset');

/* GET training set. */
router.get('/', async function (req, res, next) {
    let classes = await engine.getClassesConfig();
    let configs = await engine.getEngineConfig();
    let docs = await trainingSet.getTrainingSet('', configs);

    res.render('training-engine', { title: 'Training Engine', docs: docs, classes: classes, configs: configs});
});

router.post('/', async function (req, res, next) {
    if (req.body.formBtn === 'save') {
        await engine.saveClassesConfig(req.body.classes);
        await engine.saveTrainConfig(req.body.limit, req.body.field, req.body.order);
    }
    else if(req.body.formBtn === 'train') {
        console.log('call train.mjs');//todo verificar como chamar a ação do modulo train.mjs
    }

    let classes = await engine.getClassesConfig();
    let configs = await engine.getEngineConfig();

    if (req.body.formBtn === 'save') {
        await trainingSet.setTrainingSet(classes.filter(c => c.active === 1), configs);
    }

    let docs = await trainingSet.getTrainingSet('', configs);

    res.render('training-engine', { title: 'Training Engine', docs: docs, classes: classes, configs: configs});
});

module.exports = router;