// it is use to save user queries in mongodb
let UserChatHistory = require('../../../models/userChatHistory');
let User = require('./../../../models/user');
let log4js = require('log4js');
let logger = log4js.getLogger();
module.exports = function(email, isUnAnswered, question, answerObj) {
    /* @yuvashree: fetching the domain from DB */
    User.findOne({
        $or: [
            {
                'local.email': email
            }, {
                'google.email': email
            }, {
                'facebook.email': email
            }
        ]
    }, function(error, data) {
        if (error) {
            return error;
        }
        let domain = data.local.loggedinDomain;
        /* @yuvashree: to save chat with domain */
        UserChatHistory.findOne({
            email: email
        }, function(err, data) {
            // if data is not present then initialize a new UserChatHistory or add in existing database
            if (!data) {
                let newUserChatHistory = new UserChatHistory();
                newUserChatHistory.email = email;
                let chat = {};
                chat.isUnAnswered = isUnAnswered;
                chat.question = question;
                chat.answerObj = answerObj;
                /* @yuvashree: added a new key domain to make the history domain specific */
                chat.domain = domain;
                newUserChatHistory.chats = [];
                newUserChatHistory.chats.push(chat);
                newUserChatHistory.save(function(err, data) {
                    logger.debug(data);
                }// to add chat queries to the existing history
                );
            } else {
                let chat = {};
                chat.isUnAnswered = isUnAnswered;
                chat.question = question;
                chat.answerObj = answerObj;
                chat.answerDate = new Date().toLocaleString();
                /* @yuvashree: added a new key domain to make the history domain specific */
                chat.domain = domain;
                data.chats.push(chat);
                data.save(function(error) {
                    if (error) {
                        logger.debug('Error in saving chat');
                        logger.debug(error);
                    }
                });
            }
        });
    });
};
