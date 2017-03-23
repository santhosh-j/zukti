/* @ramvignesh: updating the user's current domain in mongo */
/* @deepika: updating the user's tracked domain in mongo */
let User = require('./../../../models/user');
let log4js = require('log4js');
let logger = log4js.getLogger();
let setLoginDomain = function(email, domain, domainSet) {
  logger.debug(email + ' inside setLogin Domain');
    User.findOneAndUpdate({
      $or: [{ 'local.email': email }, { 'google.email': email }, { 'facebook.email': email }]
  }, {
        $set: {
            'local.loggedinDomain': domain,
            'local.domain': domainSet
        }
    }, function(error) {
      logger.debug(error);
        if (error) {
            return 'LoggedinDomain not updated';
        }
        logger.debug('updated');
        return 'LoggedinDomain updated successfully';
    });
};

module.exports = setLoginDomain;
