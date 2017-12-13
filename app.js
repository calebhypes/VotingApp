const   express             = require('express'),
        mongoose            = require('mongoose'),
        bodyParser          = require('body-parser'),
        expressSanitizer    = require('express-sanitizer'),
        methodOverride      = require('method-override'),
        passport            = require('passport'),
        GitHubStrategy      = require('passport-github2').Strategy,
        User                = require('./models/user'),
        flash               = require('connect-flash'),
        app                 = express();

// require routes
const indexRoutes       = require('./routes/index'),
      pollRoutes        = require('./routes/polls');

require('dotenv').config();
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer())
mongoose.connect('mongodb://localhost/voting', {useMongoClient: true});
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public'));
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use('/', indexRoutes);
app.use('/polls', pollRoutes);

app.use((req, res, next) => {
    res.status(404).render('404');
});

app.listen(3000, () =>  {
    console.log('Voting server is running...');
});