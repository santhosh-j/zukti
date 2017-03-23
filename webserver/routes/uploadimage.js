const express = require('express');
const router = express.Router();
const multer = require('multer');
let name;
/* Uploaded images stored in a given directory with extensions */
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './webserver/images');
    },
    filename: function(req, file, cb) {
        let extArray = file.mimetype.split('/');
        let extension = extArray[extArray.length - 1];
        name = req.user.local.email + '.' + extension;
        cb(null, name);
    }
});
const upload = multer({storage: storage});
/* POST to upload the images. */
router.post('/upload', upload.any('IMG'), function(req, res) {
    res.end(name);
});
module.exports = router;
