const mongoose = require('mongoose');

const unansweredQuerySchema = mongoose.Schema({
    user: String,
    username: String,
    question: {type: String, required: true, unique: true},
    keywords: Array,
    intents: Array
});

module.exports = mongoose.model('unansweredQuery', unansweredQuerySchema);
