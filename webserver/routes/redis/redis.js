/* @navinprasad: redis routes */
let express = require('express');
let router = express.Router();
let fetchIntents = require('./functions/getIntents');
let fetchKeywords = require('./functions/getKeywords');
let fetchTypes = require('./functions/getTypes');

router.get('/getIntents', function(req, res) {
  let resultCallback = function(Intents) {
  res.json({
    Intents
  });
};
  fetchIntents(resultCallback);
});

router.get('/getKeywords', function(req, res) {
  let resultCallback = function(Keywords) {
      res.json({
        Keywords
      });
};
  fetchKeywords(resultCallback);
});

router.get('/getTypes', function(req, res) {
  let resultCallback = function(Types) {
      res.json({
          Types
      });
};
  fetchTypes(resultCallback);
});


module.exports = router;
