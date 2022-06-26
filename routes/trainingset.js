const express = require('express');
const router = express.Router();
const corpus = require('../database/corpus');
const engine = require('../database/engine');

/* GET training set. */
router.get('/', async function (req, res, next) {
    let docs = await corpus.getDocuments(req.query.genre, 100);
    let classes = await engine.getClassesConfig();
    let configs = await engine.getTrainConfig();

    res.render('trainingset', { title: 'Training Engine', docs: docs, classes: classes, configs: configs});
});

module.exports = router;
