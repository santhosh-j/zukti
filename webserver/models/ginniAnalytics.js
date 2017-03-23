const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ginniAnalyticsSchema = new Schema({
    queriesAsked: Number,
    unanswered: Number
  });
const ginniAnalytics = mongoose.model('ginniAnalytics', ginniAnalyticsSchema);
module.exports = ginniAnalytics;
