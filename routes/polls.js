const express   = require('express'),
      router    = express.Router(),
      ObjectId  = require('mongodb').ObjectID,
      Poll      = require('../models/poll');


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
                    res.render('polls/index', {polls: allPolls, recent: recentPolls, currentUser: req.user})
                }
            });
        };
    });
});

// Create - Add new poll to DB
router.post('/', (req, res) => {
    var question = req.body.question;
    var optionsList = req.body.options.split(/\n/);
    var creator = {
        id: req.user._id,
        username: req.user.username
    };
    var options = [];

    for (var i=0; i < optionsList.length; i++) {
        // only push options that contain non-whitespace characters
        if (/\S/.test(optionsList[i])) {
            // Push separate options objects to pollOptions within poll schema.
            options.push({ option: optionsList[i].trim(), tally: 0 });
        }        
    }

    var newPoll = {question: question, pollOptions: options, creator: creator}

    Poll.create(newPoll, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/polls');
        }
    });
});

// New - Form to add new poll
router.get('/new', (req, res) => {
    res.render('polls/new');
});

// Show - Show selected poll info
router.get('/:id', (req, res) => {
    Poll.findById(req.params.id).exec((err, foundPoll) => {
        if (err) {
            console.log(err);
        } else {
            res.render("polls/show", {poll: foundPoll});
        };
    });
});

// Edit - Edit Poll
router.get('/:id/edit', (req, res) => {
    res.send('edit poll!');
});

// Update - Update edited poll
// example update => b.polls.update({"pollOptions": {$elemMatch: {"_id": ObjectId("5a1ef162981bcaab9fb37a50")}}}, {$inc: {"pollOptions.$.tally": 5000}});
router.put('/:id', (req, res) => {
    var userChoice = req.body.polloption;
    console.log(req.params.id);
    if (userChoice != 'other') {
        Poll.findOneAndUpdate({"pollOptions": {$elemMatch: {"_id": ObjectId(userChoice)}}}, {$inc: {"pollOptions.$.tally": 1}}, (err, updatedPoll) => {
            console.log('User Choice: ' + userChoice);
            console.log(updatedPoll);
            if (err) {
                console.log(err);
            } else {
                res.redirect("/polls/" + req.params.id);
            }
        })
     } else {
        res.send("Add new option!");
    }
});

// Destroy - Delete selected poll
router.delete('/:id', (req, res) => {
    res.send('Poll deleted!');
});

module.exports = router;