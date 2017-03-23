// load the things we need
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config/auth');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({

    local: {
        token: String,
        firstname: String,
        lastname: String,
        email: String,
        password: String,
        authType: String,
        localType: {
          type: String,
          default: 'Customer'
        },
        name: String,
        loggedinStatus: {
          type: Boolean,
          default: false
        },
        isEmailVerified: Boolean,
        verificationID: String,
        photos: String,
        loggedinDomain: {
          type: String,
          default: 'nil'
        },
        domain: Array,
        abusecount: {
          type: Number,
          default: 0
        }
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        displayName: String,
        photos: String,
        authType: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String,
        displayName: String,
        photos: String,
        authType: String
    }

});
// generating a hash
userSchema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.statics.generateHashVID = function(verificationID) {
    return bcrypt.hashSync(verificationID, bcrypt.genSaltSync(8), null);
};
userSchema.statics.generateHashEmail = function(email) {
    return bcrypt.hashSync(email, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
userSchema.methods.validVID = function(verificationID) {
    return bcrypt.compareSync(verificationID, this.local.verificationID);
};
userSchema.methods.validEmail = function(email) {
    return bcrypt.compareSync(email, this.local.email);
};
userSchema.statics.generateToken = function(email) {
    let token = jwt.sign({
        id: email
    }, CONFIG.JWT.secret, {
        expiresIn: 15 * 60
    });
    return token;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('user', userSchema);
