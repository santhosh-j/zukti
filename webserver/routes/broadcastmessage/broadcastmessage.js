// this is used to save broadcast message sent by admin
let express = require('express');
let router = express.Router();
let Broadcast = require('../../models/broadcast');
// save broadcast message in mongodb
router.post('/', function(req, res) {
    let username = req.body.username;
    // admin can login using local login only
    let email = req.user.local.email;
    let value = req.body.message;
    let date = req.body.date;
    let messages = new Broadcast({
        username: username,
        email: email,
        value: value,
        date: date
    });
    // save in messages
    messages.save((error) => {
        if (error) {
            res.json({
                saved: false
            });
        } else {
            res.json({
                saved: true
            });
        }
    });
});
module.exports = router;
