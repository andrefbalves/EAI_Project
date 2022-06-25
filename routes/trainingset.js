const express = require('express');
const router = express.Router();
const corpus = require('../database/corpus');

/* GET training set. */
router.get('/', function(req, res, next) {
    corpus.getDocuments(req.query.genre, 100).then(docs => res.render('trainingset', { title: 'Training Engine', data: docs}));
});

module.exports = router;
