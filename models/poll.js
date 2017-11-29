const mongoose      = require('mongoose');

var PollSchema = new mongoose.Schema({
    question: String,
    pollOptions: [{option: String}],
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