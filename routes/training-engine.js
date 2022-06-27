const express = require('express');
const router = express.Router();
const corpus = require('../database/corpus');
const engine = require('../database/engine');

/* GET training set. */
router.get('/', async function (req, res, next) {
    let docs = await corpus.getDocuments(req.query.genre, 100);
    let classes = await engine.getClassesConfig();
    let configs = await engine.getEngineConfig();

    res.render('training-engine', { title: 'Training Engine', docs: docs, classes: classes, configs: configs});
});

router.post('/', async function (req, res, next) {
    if (req.body.formBtn === 'save') {
        await engine.saveClassesConfig(req.body.classes);
        await engine.saveTrainConfig(req.body.limit, req.body.field, req.body.order);
    }

    let docs = await corpus.getDocuments(req.query.genre, 100);
    let classes = await engine.getClassesConfig();
    let configs = await engine.getEngineConfig();

    res.render('training-engine', { title: 'Training Engine', docs: docs, classes: classes, configs: configs});
});

module.exports = router;
