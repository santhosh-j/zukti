/* @navinprasad: fetch the intents from redis */
let client = require('./redisClient');

module.exports = function(intentCallBack) {
    client.smembers('intents', function(err, reply) {
        if (err) {
            throw err;
        }
        intentCallBack(reply);
    });
};
