let express = require('express');
let saveQuestionAnswer = require('./saveQuestionAnswer');
let processQuestion = require('./processQuestion');
let voteAnswer = require('./voteAnswer');
let router = express.Router();
let client = require('./redis');

// router to verify input question has keyword or not
router.post('/verifyQuestion', function(req, res) {
    let question = req.body.question;
    lexicon();
    let keywordLexicon = [];
    let intentLexicon = [];
    let log4js = require('log4js');
    let logger = log4js.getLogger();
    /* @yuvashree: fetching intents and lexicons from redis */
    function lexicon()
    {
      client.hkeys('keywords', function(err, reply) {
          keywordLexicon = reply;
      });
      client.hkeys('intents', function(err, reply) {
          intentLexicon = reply;
          callBack();
      });
    }

    /* @yuvashree: call back to process the question */
    function callBack()
    {
    let questionInfo = processQuestion(question,keywordLexicon,intentLexicon);
    logger.debug(questionInfo.keywords+",,,,,,,,,typed now");
        if (questionInfo.keywords.length === 0) {
        res.json({
            isValidQuestion: false,
            errorMessage: 'The question must have a keyword'
        });
    }
    else if (questionInfo.intents.length === 0) {
        res.json({
            isValidQuestion: false,
            errorMessage: 'The question must have an intent'
        });
      }
    else{
      res.json({isValidQuestion: true});
    }
  }
});
// router to add a question answer set to Ginni knowledge base
router.post('/addQuestionAnswer', function(req, res) {
    // callback when a new question answer will be created
    let questionsAnswerSavedCallback = function(id) {
        // unique id given to each questionsAnswerSet
        res.json({
            id: id
        });
    };
    // function call to save question and answer in neo4j database
    saveQuestionAnswer(req, questionsAnswerSavedCallback);
});
  // router to rate answer which user liked
router.post('/rateAnswer', function(req, res) {
  let action = req.body.action;
  let type = req.body.type;
  let value = req.body.value;
  let user = req.body.email;
  // method to save user preference in neo4j
  voteAnswer(action, type, value, user);
  res.send('done');
});
module.exports = router;
