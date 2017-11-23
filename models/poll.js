const mongoose      = require('mongoose');

var PollSchema = new mongoose.Schema({
    pollTitle: String,
    pollOptions: [{option: String}],
    creationDate: {type: Date, default: Date.now()},
});

module.exports = mongoose.model('Poll', PollSchema);