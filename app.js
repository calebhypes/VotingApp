const   express         = require('express'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        GitHubStrategy  = require('passport-github2').Strategy,
        User            = require('./models/user'),
        app             = express();

// require routes
const indexRoutes       = require('./routes/index'),
      pollRoutes        = require('./routes/polls');

require('dotenv').config();
mongoose.connect('mongodb://localhost/voting', {useMongoClient: true});
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//Passport configuration
app.use(require('express-session')({
    secret: 'The secret to end all secrets!',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use('/', indexRoutes);

app.listen(3000, () =>  {
    console.log('Voting server is running...');
});