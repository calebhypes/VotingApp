const express           = require('express'),
      router            = express.Router(),
      User              = require('../models/user'),
      Poll              = require('../models/poll'),
      passport          = require('passport'),
      GitHubStrategy    = require('passport-github2').Strategy;

      
// dotenv require for process env's
require('dotenv').config();

// Index route
router.get('/', (req, res) => {
    Poll.find().sort({ 'creationDate': -1}).exec((err, recentPolls) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {recent: recentPolls, currentUser: req.user})
        }
    });
});

// =======================
// Authentication routes
// =======================

// login/signup logic
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
},
(accessToken, refreshToken, profile, done) => {
    var searchQuery = {
        username: profile.displayName
    };

    var updates = {
        username: profile.displayName,
        ID: profile.id
    };

    var options = {
        upsert: true
    };

    // update the user if s/he exists or add a new user
    User.findOneAndUpdate(searchQuery, updates, options, (err, user) => {
        if(err) {
            return done(err);
        } else {
            console.log(user);
            return done(null, user);
        }
    });
}));


// github authentication route
router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ]}));

// login route
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
    console.log(req.user.username + " logged in successfully");
    // res.json(req.user);
});

// logout logic
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;