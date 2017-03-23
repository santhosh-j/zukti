// to save queries asked and unanswered queries
let GinniAnalytics = require('../../../models/ginniAnalytics');
let log4js = require('log4js');
let logger = log4js.getLogger();
module.exports = function(isUnAnswered) {
    GinniAnalytics.findOne({}, (err, data)=> {
    let ginniAnalytics;
    if(!data) {
       ginniAnalytics = new GinniAnalytics();
       ginniAnalytics.queriesAsked = 1;
       ginniAnalytics.unanswered = 0;
       if(isUnAnswered) {
         ginniAnalytics.unanswered = ginniAnalytics.unanswered + 1;
       }
    }
    else{
      ginniAnalytics = data;
      ginniAnalytics.queriesAsked = ginniAnalytics.queriesAsked + 1;
      if(isUnAnswered) {
        ginniAnalytics.unanswered = ginniAnalytics.unanswered + 1;
      }
    }
    ginniAnalytics.save(function(error) {
      if(error) {
        logger.debug(error);
      }
    });
  });
};
