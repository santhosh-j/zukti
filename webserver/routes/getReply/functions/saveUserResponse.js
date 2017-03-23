let UserChatHistory = require('../../../models/userChatHistory');
let User = require('./../../../models/user');
// @Deepika : To update the user response in db
module.exports = function(email, type, answer, liked, disliked) {
    console.log('enter in the save response file');

    let newObject = [];

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
    }, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('chathistories data' + data);

            UserChatHistory.findOne({
                'email': email
            }, function(err1, records) {
                if(err1) {
                  console.log(err1);
                } else {
                  console.log(records);
                  records.chats[0].answerObj.map(function(answerItem, index) {
                    console.log(index, ': ' , JSON.stringify(answerItem));
                    console.log('answer.value: ', answer);
                    console.log('type: ', type);
                    console.log('answerItem: ', JSON.stringify(answerItem));
                    if(answerItem[type]) {
                      console.log('answerItem has a ', type, ' array');
                      answerItem[type].map(function(item, ind) {
                        console.log(type, ind);
                        if(item.value === answer) {
                          console.log('match found');
                          item.likes = liked;
                          item.dislikes = disliked;
                        }
                      });
                    }
                    newObject.push(answerItem);
                    console.log('save response file '+ JSON.stringify(newObject));
                  });

                  UserChatHistory.findOneAndUpdate({
                    'email': email
                  }, {
                    $set: {'chats.0.answerObj': newObject }
                  }, function(err2, result) {
                    if(err2) {
                      console.log(err2);
                    } else {
                      console.log('final',result);
                    }
                  });
                }
            });
        }
    });
};
