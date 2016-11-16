var FacebookStrategy = require('passport-facebook').Strategy;
var facebookAuth = require('./auth').facebookAuth;

var User = require('../models/index').User;
var Bar = require('../models/index').Bar;

module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: facebookAuth.clientID,
        clientSecret: facebookAuth.clientSecret,
        callbackURL: facebookAuth.callbackURL,
        profileFields: ['id', 'emails', 'name'],
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done){
        User.findOne({'facebook.id': profile.id}, function(err, user){
            if(err){
                done(err);
            }else{
                if(user){
                    return done(null, user);
                }else{
                    var newUser = new User();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = accessToken;
                    newUser.facebook.name = profile.name.givenName+' '+profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;

                    newUser.save(function(err){
                        if(err){
                            return done(err);
                        }else{
                            return done(null, newUser);
                        }
                    })
                }
            }
        })
    }));
};
