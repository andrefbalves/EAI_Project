const express = require('express');
const router = express.Router();
const engine = require('../database/engine');
const terms = require('../database/terms');

/* GET training set. */
router.get('/', async function (req, res, next) {
    let configs = await engine.getEngineConfig();
    let bestTerms = await terms.selectKBest('', configs.test_limit_of_records, configs.test_metric, configs.test_operation, configs.test_type_of_gram);
    let classes = await engine.getClassesConfig();

    res.render('test-engine', { title: 'Test Engine', terms: bestTerms, classes: classes, configs: configs});
});

module.exports = router;
