const express   = require('express'),
      router    = express.Router(),
      Poll      = require('../models/poll');


// Index - Display all polls
router.get('/', (req, res) => {
    Poll.find({}, (err, allPolls) => {
        if (err) {
            console.log(err);
        } else {
            res.render('polls/index', {polls: allPolls, currentUser: req.user})
        }
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
router.put('/:id', (req, res) => {
    res.send('Poll updated')
});

// Destroy - Delete selected poll
router.delete('/:id', (req, res) => {
    res.send('Poll deleted!');
});

module.exports = router;