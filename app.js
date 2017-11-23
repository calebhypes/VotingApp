const   express         = require('express'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        GitHubStrategy  = require('passport-github2').Strategy,
        User            = require('./models/user'),
        app             = express();

require('dotenv').config();
mongoose.connect('mongodb://localhost/voting', {useMongoClient: true});
app.set('view engine', 'ejs');

//Passport config
app.use(require('express-session')({
    secret: 'The secret to end all secrets!',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

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
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
        if(err) {
            return done(err);
        } else {
            console.log(user);
            return done(null, user);
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ]}));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    res.json(req.user);
});

app.listen(3000, () =>  {
    console.log('Voting server is running...');
});