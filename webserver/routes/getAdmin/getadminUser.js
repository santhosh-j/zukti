let express = require('express');
let router = express.Router();
let User = require('../../models/tempUserModel');

// get admin details
router.get('/', function(req, res) {
    User.find(function(err, user) {
      if (err) {
      res.send(err);
    }
      else {
        res.json(user);
      }
    });
});

module.exports = router;
