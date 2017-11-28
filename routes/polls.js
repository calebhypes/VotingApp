const express   = require('express'),
      router    = express.Router(),
      Poll      = require('../models/poll');


// Index - Display all polls
router.get('/', (req, res) => {
    res.render('polls/index')
});

// Create - Add new poll to DB
router.post('/', (req, res) => {
    res.send('new poll posted!');
});

// New - Form to add new poll
router.get('/new', (req, res) => {
    res.send('Create new poll!');
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