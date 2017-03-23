/* @navinprasad: fetch the type of answer from redis */
let client = require('./redisClient');

module.exports = function(resultCallback) {
    client.smembers('types', function(err, reply) {
        if (err) {
            throw err;
        }
        // return reply;
        resultCallback(reply);
    });
};
