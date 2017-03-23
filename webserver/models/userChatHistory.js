const mongoose = require('mongoose');

const userChatHistory = mongoose.Schema({
    email: String,
    chats: Array
});

module.exports = mongoose.model('userChatHistory', userChatHistory);
