let express = require('express');
let router = express.Router();
let displayQuestionAnswerSet = require('./displayQA');

// router to get question answer set
router.get('/', function(req, res)
{
  let resultCallback = function(questionanswerSet) {
      res.json({
          questionanswerSet: questionanswerSet
      });
  };
  displayQuestionAnswerSet.allQuestionAnswer(resultCallback);
});

/* @yuvashree: router to get intent question */
router.get('/intents/:intent', function(req, res)
{
  let intent = req.params.intent;
  let intentCallback = function(intentSet) {
      res.json({
          intentSet: intentSet
      });
  };
  displayQuestionAnswerSet.intentAnswer(intent, intentCallback);
});

/* @yuvashree: router to get keyword question */
router.get('/keywords/:keyword', function(req, res)
{
  let keyword = req.params.keyword;
  let keywordCallback = function(keywordSet) {
      res.json({
          keywordSet: keywordSet
      });
  };
  displayQuestionAnswerSet.keywordAnswer(keyword, keywordCallback);
});

/* @yuvashree: router to get intent and keyword question */
router.get('/keywordsandintents/:intent/:keyword', function(req, res)
{
  let intent = req.params.intent;
  let keyword = req.params.keyword;
  let keywordandintentCallback = function(keywordandintentSet) {
      res.json({
          keywordandintentSet: keywordandintentSet
      });
  };
  displayQuestionAnswerSet.keywordintentAnswer(intent, keyword, keywordandintentCallback);
});

module.exports = router;
