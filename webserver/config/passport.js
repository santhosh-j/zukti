// loading up the required stratigies
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
// loading up the configuration file containing facebook and goole authentication configuration
const configAuth = require('./auth');
// load up the user model
const User = require('../models/user');

let log4js = require('log4js');
let logger = log4js.getLogger();
module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    //  @Mayanka: Not allowing to login abusive user
    let returnAbuseResponse = function(){
      const error = new Error('ABUSIVE USER');
      error.name = 'Your account has been suspended.... Because Abusers are not allowed here';
      return error.name;

    }
        passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false,
        passReqToCallback: true
    }, function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({
                'local.email': email
            }, function(err, user) {
               if (!user) {
                  const error = new Error('Your Email ID is not registered');
                  error.name = 'You have not Registered Yet! Please Sign Up first';
                  return done(error.name);
              }
  // @Mayanka: Check if user has signed up and been abusive and redirect to failure page
               else if(user.abusecount == 4)  {
                 done(returnAbuseResponse());
              }
              else  if (err) {
                    return done(err);
                } else if (!user.local.isEmailVerified) {
                    const error = new Error('Email ID is not Verified');
                    error.name = 'Please verify your registered mail!';
                    return done(error.name);
                } else if (!user.validPassword(password)) {
                    const error = new Error('Incorrect password');
                    error.name = 'Please enter correct password!';
                    return done(error.name);
                }
                else {
                    let userData = {};
                    userData._id = user._id;
                    userData.email = user.local.email;
                    userData.firstname = user.local.firstname;
                    userData.lastname = user.local.lastname;
                    userData.name = user.local.name;
                    userData.authType = user.local.authType;
                    userData.localType = user.local.localType;
                    userData.photos = user.local.photos;
                    userData.token = User.generateToken(userData.email);
                    User.update({
                        'local.email': userData.email
                    }, {
                        $set: {
                            'local.loggedinStatus': true
                        }
                    }, function(error) {
                        if (error) {
                            logger.debug('status not updated');
                        } else {
                            logger.debug('LoginStatus updated Successfully');
                        }
                    });
                    return done(null, userData);
                }
            });
        });
    }));
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    let fbStrategy = configAuth.FACEBOOK;
    String.prototype.capitalize = function() {
       return this.replace(/ ( ^|\s)([a-z])/g,
       function(m, p1, p2) { return p1 + p2.toUpperCase(); });
      };
    fbStrategy.passReqToCallback = true;
    // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    passport.use(new FacebookStrategy(fbStrategy,
      function(req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // check if the user is already logged in
            if (!req.user) {
                User.findOne({
                    'facebook.id': profile.id
                }, function(err, user) {
   // @Mayanka: Check if user has been abusive and redirect
                  if(user != null){
                   if(user.abusecount == 4)  {
                    return done(returnAbuseResponse());
                  }
                }
                  else  if (err) {
                        return done(err);}
                    if (user) {
                        /* if there is a user id already but no token
                        (user was linked at one point and then removed) */
                        if (!user.facebook.token) {
                          user.facebook.token = token;
                            user.facebook.email = (profile.emails[0].value || '').toLowerCase();
                            user.facebook.displayName = profile.displayName.toLowerCase().capitalize();
                            user.facebook.photos = profile.photos[0].value;
                            user.facebook.authType = 'facebook';
                            user.save(function(error) {
                                if (error) {
                                    return done(err);
                                  }
                                return done(null, user);
                            });
                        }
                        return done(null, user);
                        // user found, return that user
                    } else {
                        // if there is no user, create them
                        let newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
                        newUser.facebook.displayName = profile.displayName.toLowerCase().capitalize();
                          newUser.facebook.photos = profile.photos[0].value;
                          newUser.facebook.authType = 'facebook';
                        newUser.save(function(error) {
                            if (error) {
                                return done(error);
                              }
                            return done(null, newUser);
                        });
                    }
                    return done(null, user);
                });
            } else {
                // user already exists and is logged in, we have to link accounts
                let user = req.user;
                // pull the user out of the session
                user.facebook.id = profile.id;
                user.facebook.token = token;
                  user.facebook.email = (profile.emails[0].value || '').toLowerCase();
                  user.facebook.displayName = (profile.displayName).toLowerCase().capitalize();
                  user.facebook.photos = profile.photos[0].value;
                  user.facebook.authType = 'facebook';
                user.save(function(err) {
                    if (err) {
                        return done(err);
                      }
                    return done(null, user);
                });
            }
        });
    }));
    // Google
    passport.use(new GoogleStrategy({
    clientID: configAuth.GOOGLE.clientID,
    clientSecret: configAuth.GOOGLE.clientSecret,
    callbackURL: configAuth.GOOGLE.callbackURL,
    passReqToCallback: true
    // allows us to pass in the req from our route (lets us check if a user is logged in or not)
}, function(req, token, refreshToken, profile, done) {
    // asynchronous
    logger.debug('in google sign');
    process.nextTick(function() {
        // check if the user is already logged in
        if (!req.user) {
            User.findOne({ 'google.id': profile.id }, function(err, user) {
        // @Mayanka: Check if user has been abusive and redirect
            if(user != null) {
              if(user.abusecount == 4)  {
                return done(returnAbuseResponse());
             }
           }
              else  if (err) {
                    return done(err);
                  }
                if (user) {
                    /* if there is a user id already but no token
                    (user was linked at one point and then removed) */
                    if (!user.google.token) {
                        user.google.token = token;
                        user.google.name = profile.displayName.toLowerCase().capitalize();
                        user.google.photos = profile.photos[0].value;
                        user.google.email = (profile.emails[0].value || '').toLowerCase();
                        // pull the first email
                        user.google.authType = 'google';
                        user.save(function(error) {
                            if (error) {
                                return done(error);
                              }
                            return done(null, user);
                        });
                    }
                    return done(null, user);
                } else {
                    let newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName.toLowerCase().capitalize();
                    newUser.google.photos = profile.photos[0].value;
                    newUser.google.email = (profile.emails[0].value || '').toLowerCase();
                    // pull the first email
                    newUser.google.authType = 'google';
                    newUser.save(function(error) {
                        if (error) {
                            return done(error);
                          }
                        return done(null, newUser);
                    });
                }
            });
        } else {
            // user already exists and is logged in, we have to link accounts
            let user = req.user;
            // pull the user out of the session
            user.google.id = profile.id;
            user.google.token = token;
            user.google.name = profile.displayName.toLowerCase().capitalize();
            user.google.photos = profile.photos[0].value;
            user.google.email = (profile.emails[0].value || '').toLowerCase();
             // pull the first email
            user.google.authType = 'google';
            user.save(function(err) {
                if (err) {
                    return done(err);
                  }
                return done(null, user);
            });
        }
    });
}));
};
