/* @navinprasad: fetch the keywords from redis */
let client = require('./redisClient');

module.exports = function(resultCallback) {
    client.smembers('keywords', function(err, reply) {
        if (err) {
            throw err;
        }
        // return reply;
        resultCallback(reply);
    });
};
