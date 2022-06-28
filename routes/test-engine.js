const express = require('express');
const router = express.Router();
const engine = require('../database/engine');
const terms = require('../database/terms');

/* GET training set. */
router.get('/', async function (req, res, next) {
    let configs = await engine.getEngineConfig();
    let classes = await engine.getActiveClasses();
    let bestTerms = await terms.selectKBest('All', configs);

    res.render('test-engine', { title: 'Test Engine', terms: bestTerms, classes: classes, genre: 'All', configs: configs});
});

router.post('/', async function (req, res, next) {

        await engine.saveTestConfig(req.body.limitRecords, req.body.metric, req.body.operation, req.body.typeOfGram);
        let configs = await engine.getEngineConfig();
        let classes = await engine.getActiveClasses();
        let bestTerms = await terms.selectKBest(req.body.genre, configs);

        res.render('test-engine', { title: 'Test Engine', terms: bestTerms, classes: classes,genre: req.body.genre, configs: configs});
});

module.exports = router;
