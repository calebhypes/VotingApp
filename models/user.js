const mongoose      = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    ID: String
});

module.exports = mongoose.model('User', UserSchema);