const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const CONFIG = require('../config/auth');
// const ObjectId = Schema.ObjectId;
const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    type: String,
    firstname: String,
    lastname: String,
    loggedinStatus: Boolean,
    isEmailVerified: Boolean,
    verificationID: Number,
    token: String
});
userSchema.statics.generateToken = function(email) {
    let token = jwt.sign({
        id: email
    }, CONFIG.JWT.secret, {
        expiresIn: 15 * 60
    });
    return token;
};
const userInformation = mongoose.model('userinformation', userSchema);
module.exports = userInformation;
