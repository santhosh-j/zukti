const GinniAnalytics = require('../../models/ginniAnalytics');
let express = require('express');
let router = express.Router();
let log4js = require('log4js');
let logger = log4js.getLogger();
// router to get count of queries asked by user
router.get('/', function(req, res) {
  GinniAnalytics.findOne({}, function(err, data) {
    if(err) {
      logger.debug(err);
    }
    else if(data) {
        res.json({queryCount: data.queriesAsked});
      }
      else{
        res.json({queryCount: 0});
      }
  });
});


module.exports = router;
