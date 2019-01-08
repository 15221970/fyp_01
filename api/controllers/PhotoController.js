/**
 * PhotoController
 *
 * @description :: Server-side logic for managing Photos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    upload: function (req, res) {
        if (req.session.username != undefined) {
            if (req.method == "POST") {
                User.create(req.body.User).exec(function (err, model) {
                    return res.send("Upload Created!");
                });
                 } else return res.view('photo/upload');
                 } else
            return res.view('user/login');

    },
};

