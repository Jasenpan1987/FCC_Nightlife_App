var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect:'/',
        failureRedirect: '/'
    }));

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;