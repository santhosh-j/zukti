const mongoose = require('mongoose');
const qaSchema = mongoose.Schema(
  {
    question: {type: String},
    savedResponse: {type: String},
    responseType: {type: String},
    date: {type: String}
}, { _id: true});
const bookmarksSchema = mongoose.Schema({
    email: String,
    bookmarks: [qaSchema]

}, { versionKey: false });

module.exports = mongoose.model('userBookmarks', bookmarksSchema);
