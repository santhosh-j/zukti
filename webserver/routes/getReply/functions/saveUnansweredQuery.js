// to save unanswered Query
let UnansweredQuery = require('../../../models/unansweredQuery');
let log4js = require('log4js');
let logger = log4js.getLogger();
module.exports = function(username, email, question, keywords, intents) {
    let unansweredQuery = new UnansweredQuery();
    unansweredQuery.user = email;
    unansweredQuery.username = username;
    unansweredQuery.question = question;
    unansweredQuery.keywords = keywords;
    unansweredQuery.intents = intents;
    unansweredQuery.save((error) => {
        if (error) {
            logger.debug(error);
        } else {
            logger.debug('saved ' + question);
        }
    });
};
