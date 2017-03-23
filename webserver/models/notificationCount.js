const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const notificationCount = new Schema({
    email: String,
    countOfNotification: Number
  });
const Notification = mongoose.model('Notification', notificationCount);
module.exports = Notification;
