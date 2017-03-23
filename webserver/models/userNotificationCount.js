const mongoose = require('mongoose');

const userNotificationCount = mongoose.Schema({
    email: String,
    count: Number
});

module.exports = mongoose.model('userNotificationCount', userNotificationCount);
