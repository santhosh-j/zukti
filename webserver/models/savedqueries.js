const mongoose = require('mongoose');
const qaSchema = mongoose.Schema(
  {
    question: {type: String},
    answer: {type: String}, date: {type: String}
}, { _id: true});
const savedQuerySchema = mongoose.Schema({
    email: String,
    savedquery: [qaSchema]

}, { versionKey: false });

module.exports = mongoose.model('savedQuery', savedQuerySchema);
