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
    // res.send('new poll posted!');
    var question = req.body.question;
    var optionsList = req.body.options.split(/\n/);
    // var options = [];
    var creator = {
        id: req.user._id,
        username: req.user.username
    };

    // for (var i=0; i < optionsList.length; i++) {
    //     if (/\S/.test(optionsList[i])) {
    //         poll.pollOptions.options.push(optionsList[i].trim());
    //     }        
    // }

    var newPoll = {question: question, creator: creator}

    // Poll creation is working however currently there is an issue with adding the trimmed options to the pollOptions array.
    Poll.create(newPoll, (err, poll) => {
        if (err) {
            console.log(err);
        } else {
            for (var i=0; i < optionsList.length; i++) {
                if (/\S/.test(optionsList[i])) {
                    poll.pollOptions.push(optionsList[i].trim());
                }        
            }
            console.log(poll.pollOptions[0].option);
            res.redirect('/polls');
        }
    });
    // res.send('Here are the options for the poll titled \'' + question +'\': ' + options);
});

// New - Form to add new poll
router.get('/new', (req, res) => {
    res.render('polls/new');
});

// Show - Show selected poll info
router.get('/:id', (req, res) => {
    res.send('Poll information!');
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