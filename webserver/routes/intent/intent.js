let express = require('express');
let fetchBaseIntents = require('./functions/fetchBaseIntents');
let fetchSameAsIntents = require('./functions/fetchSameAsIntents');
let addNewSameAsIntent = require('./functions/addNewSameAsIntent');
let CreateIntent = require('./functions/CreateIntent');
let router = express.Router();

// route to all base intents e.g what why
router.get('/baseIntents', function(req, res) {
    let resultCallback = function(baseIntents) {
        res.json({
            baseIntents
        });
    };
    fetchBaseIntents(resultCallback);
});
// router to get same intents
router.get('/getSameAsIntents', function(req, res) {
    let baseIntent = req.query.baseIntent;
    let resultCallback = function(sameAsIntents) {
        res.json({
            sameAsIntents
        });
    };
    fetchSameAsIntents(baseIntent, resultCallback);
});
// roter to add new intent which is same to base intent
router.post('/addNewSameAsIntent', function(req, res) {
    let baseIntent = req.body.baseIntent;
    let newSameAsIntent = req.body.newSameAsIntent;
    let resultCallback = function(result) {
        res.json(result);
    };
    addNewSameAsIntent(baseIntent, newSameAsIntent, resultCallback);
});
// router to create new intent
router.post('/createIntent', function(req, res) {
    let NewIntent = req.body.NewIntent;
    let resultCallback = function(result) {
        res.json(result);
    };
    CreateIntent(NewIntent, resultCallback);
});


module.exports = router;
