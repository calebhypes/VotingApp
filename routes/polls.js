const express       = require('express'),
      router        = express.Router(),
      ObjectId      = require('mongodb').ObjectID,
      Poll          = require('../models/poll'),
      middleware    = require('../middleware');


// Index - Display all polls
router.get('/', (req, res) => {
    // find all polls
    Poll.find({}, (err, allPolls) => {
        if (err) {
            console.log(err);
        } else {
            // if all polls was successful also find all polls and order by most recent.
            Poll.find().sort({ 'creationDate': -1}).limit(10).exec((err, recentPolls) => {
                if (err) {
                    console.log(err);
                } else {
                    // if recent polls was successful, also find and sort polls based on popularity.
                    Poll.find().sort({ 'totalVotes': -1}).limit(10).exec((err, popularPolls) => {
                        res.render('polls/index', {polls: allPolls, recent: recentPolls, popular: popularPolls, currentUser: req.user});
                    });
                }
            });
        };
    });
});

// Create - Add new poll to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
    var question = req.body.question;
    var optionsList = req.body.options.split(/\n/);
    var creator = {
        id: req.user._id,
        username: req.user.username
    };
    var totalVotes = 0;
    var options = [];

    for (var i=0; i < optionsList.length; i++) {
        // only push options that contain non-whitespace characters
        if (/\S/.test(optionsList[i])) {
            // Push separate options objects to pollOptions within poll schema.
            options.push({ option: optionsList[i].trim(), tally: 0 });
        }        
    }

    var newPoll = {question: question, totalVotes: totalVotes, pollOptions: options, creator: creator}

    Poll.create(newPoll, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "New poll created successfully!");
            res.redirect('/polls');
        }
    });
});

// New - Form to add new poll
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('polls/new');
});

// Show My Polls - Show polls created by signed in user
router.get('/mypolls', middleware.isLoggedIn, (req, res) => {
    // db.collection.find({'creator.id': ObjectId(user._id)});
    // finds all polls with a Creator ID that matches the current users ID.
    Poll.find({'creator.id': ObjectId(req.user._id)}, (err, userPolls) => {
        if (err) {
            console.log(err);
        } else {
            res.render('polls/userpolls', {polls: userPolls });
        }
    });
});

// Show - Show selected poll info
router.get('/:id', (req, res) => {
    Poll.findById(req.params.id).exec((err, foundPoll) => {
        if (err || !foundPoll) {
            req.flash("error", "That poll doesn't exist");
            res.redirect("/polls");
        } else {
            res.render("polls/show", {poll: foundPoll});
        };
    });
});

// Update - Update edited poll
router.put('/:id', (req, res) => {
    var userChoice = req.body.polloption;
    var userOption = req.body.other;
    // if userChoice via radio button is defined, and the custom option is undefined, proceed.
    if (userChoice && !userOption) {
        Poll.findOneAndUpdate({"pollOptions": {$elemMatch: {"_id": ObjectId(userChoice)}}}, {$inc: {"pollOptions.$.tally": 1, "totalVotes": 1}}, (err, updatedPoll) => {
            if (err) {
                console.log(err);
            } else {
                req.flash("success", "Thank you for your vote!");
                res.redirect("/polls/" + req.params.id);
            }
        })
        // if custom option is defined and user choice is undefined, proceed.
     } else if (userOption && !userChoice) {
        Poll.findByIdAndUpdate(req.params.id, {$push: {pollOptions: {option: userOption, tally: 1}}}, (err, updatedPoll) => {
            if (err) {
                console.log(err);
            } else {
                req.flash("success", "New option added and vote tallied!");
                res.redirect("/polls/" + req.params.id);
            }
        })
    } else {
        console.log("Something went wrong");
        req.flash("error", "Something went wrong! Try voting again!");
        res.redirect("/polls/" + req.params.id);
    }
});

// Destroy - Delete selected poll
router.delete('/:id', middleware.checkPollOwnership, (req, res) => {
    Poll.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            req.flash("error", "There was an error deleting the selected poll, try again!");
            res.redirect("/polls");
        } else {
            req.flash("success", "Selected poll deleted successfully!");
            res.redirect("/polls");
        }
    });
    // res.send('Poll deleted!');
});

module.exports = router;