// this route is used to save,get and delte bookmarked answers in database
const express = require('express');
const router = express.Router();
const UserBookmarks = require('../../models/userBookmarks');
let log4js = require('log4js');
let logger = log4js.getLogger();
// router to get user bookmarked answers from mongodb
router.get('/', function(req, res) {
  let email = req.user.local.email || req.user.facebook.email || req.user.google.email;
  UserBookmarks.find({email: email}, function(err, userBookmarks) {
    if(err) {
      res.status(500).send('Error in retriving saved bookmarks');
    }
    else{
      res.json(userBookmarks);
    }
  });
});
// router to save bookmarks in database
router.post('/', function(req, res, next) {
    let email = req.user.local.email || req.user.facebook.email || req.user.google.email;
    let question = req.body.question;
    let responseType = req.body.responseType;
    let savedResponse = req.body.savedResponse;
    let date = req.body.date;
    // finding in UserBookmarks mongo model with email
      UserBookmarks.findOne({
        email: email
    }, function(err, userBookmarks) {
        if (!userBookmarks) {
            let bookmark = [{question: question, responseType: responseType,
               savedResponse: savedResponse, date: date}];
            let userBookmarks = new UserBookmarks();
            userBookmarks.email = email;
            userBookmarks.bookmarks = bookmark;
            userBookmarks.save(function(err, data) {
                logger.debug('saved');
                });
        } else {
            let bookmark = {question: question, responseType: responseType,
              savedResponse: savedResponse, date: date};
            let bookmarks = userBookmarks.bookmarks;
            bookmarks.unshift(bookmark);
            userBookmarks.bookmarks = bookmarks;
            userBookmarks.save(function(error) {
              if(error) {
                logger.debug(error);
              }
              else {
                logger.debug('saved');
              }
            });
        }
    });
});
// router to delete bookmarked answers from mongodb
router.delete('/:bookmarkId', function(req, res) {
    let email = req.user.local.email || req.user.facebook.email || req.user.google.email;
    UserBookmarks.update(
    {email: email},
    {
      $pull: {
        bookmarks: {
          _id: req.params.bookmarkId
        }
      }
    }, false, function(err) {
      if(err) {
        res.status(500).send('Error in deleting bookmark');
      }
      else{
        res.send('saved');
      }
    });
});
module.exports = router;
