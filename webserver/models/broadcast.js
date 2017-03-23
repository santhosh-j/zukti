const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const broadcast = new Schema({
    username: String,
    value: String,
    email: String,
    date: String
  });

const broadcastInformation = mongoose.model('Broadcast', broadcast);
module.exports = broadcastInformation;
