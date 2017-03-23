const jwt = require('jsonwebtoken');
const CONFIG = require('../config/auth');

module.exports = function(req, res, next) {
    // check the header or post parameters for TOKEN
    let token = req.body.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies the token
        jwt.verify(token, CONFIG.JWT.secret, function(err, decoded) {
            if (err) {
                    res.json({
                    success: false,
                    message: 'Failed to authenticate the user'
                });
            }
            // if decoded save to request for use in other routes
            req.decoded = decoded;
            next();
        });
    }
    else{
        res.status(403).send({
        success: false,
        message: 'No token provided'
      });
    }
};
