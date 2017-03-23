let express = require('express');
let router = express.Router();
let UserChatHistory = require('./../../models/userChatHistory');
let User = require('./../../models/user');

// router to retrive user chat history
router.get('/', function(req, res) {
    let email = req.query.email || req.user.local.email ||
     req.user.facebook.email || req.user.google.email;
     /* @yuvashree: to retrieve chat with domain */
     User.findOne({
       $or: [ { 'local.email': email }, { 'google.email': email }, { 'facebook.email': email } ]
     }, function(error,data) {
     if (error) {
         return error;
     }
       let domain = data.local.loggedinDomain;
    UserChatHistory.findOne({
        email: email
    }, function(err, data) {
        if (err) {
            res.json({restrived: false});
        } else {
          if(data !== null)
          {
            let new_data = [];
            data.chats.map(function(chat){
              if(chat.domain === domain)
              {
                new_data.push(chat);
              }
            })
            data.chats = new_data;
          }
            res.json(data);
        }
    });
  });
});
module.exports = router;
