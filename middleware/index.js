const Poll      = require('../models/poll'),
      User      = require('../models/user');

var middlewareObj = {};

middlewareObj.checkPollOwnership = (req, res, next) => {
    if (req.isAuthenitcated()) {
        Poll.findById(req.params.id, (err, foundPoll) => {
            if (err) {
                req.flash("error", "Sorry, we couldn't find that poll!");
                console.log("error: poll not found");
                res.redirect("/polls");
            } else {
                if (foundPoll.creator.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    console.log("Uh oh! You don't have permission to do that!");
                    res.redirect("/polls");
                };
            };
        });
    } else {
        req.flash("error", "You must be looged in to do this!");
        console.log("You must be logged in to do this");
        res.redirect("/");
    };
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    };
    req.flash("error", "You must be logged in to do this!");
    console.log("You must be logged in to do this");
    res.redirect("/");
}

module.exports = middlewareObj;
