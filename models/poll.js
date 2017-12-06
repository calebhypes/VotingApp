const mongoose      = require('mongoose');

var PollSchema = new mongoose.Schema({
    question: String,
    totalVotes: Number,
    pollOptions: [ {
        option: String,
        tally: Number
    } ],
    creationDate: {
        type: Date,
        default: Date.now()
    },
    creator: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model('Poll', PollSchema);