/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    create: function (req, res) {

        if (req.method == "POST") {

            User.create(req.body.User).exec(function (err, model) {
                if (err && err.code == 'E_VALIDATION'){
                    return res.send("username has been used");
                }
                return res.redirect("/user/welcome");
            });
        } else {
            return res.view('user/create');
        }
    },

    login: function (req, res) {
        // Load the bcrypt module
        var bcrypt = require('bcrypt');

        // Generate a salt
        var salt = bcrypt.genSaltSync(10);

        if (req.method == "GET")
            return res.view('user/login');
        else {
            User.findOne({ username: req.body.username }).exec(function (err, user) {

                if (user == null)
                    return res.send("No such user");

                //  if (user.password != req.body.password)
                if (!bcrypt.compareSync(req.body.password, user.password))
                    return res.send("Wrong Password");

                console.log("The session id " + req.session.id + " is going to be destroyed.");

                req.session.regenerate(function (err) {

                    console.log("The new session id is " + req.session.id + ".");

                    req.session.username = req.body.username;

                    return res.send("login successfully.");

                });
            });
        }
    },

    logout: function (req, res) {

        console.log("The current session id " + req.session.id + " is going to be destroyed.");

        req.session.destroy(function (err) {
            //return res.send("Log out successfully.");
            return res.redirect("/");
        });
    },

    search: function (req, res) {
        return res.view('user/search');
    },

    home: function (req, res) {
        return res.view('user/home');
    },

    welcome: function (req, res) {
        return res.view('user/welcome');
    },
    admin: function (req, res) {
        return res.view('user/admin');
    },
    // upload: function (req, res) {
    //     if (req.session.username != undefined) {
    //         if (req.method == "POST") {
    //             console.log("The current session id " );
    //             User.create(req.body.User).exec(function (err, model) {
    //                 return res.send("Upload Created!");
    //             });
    //              } else return res.view('user/upload');
    //              } else
    //         return res.view('user/login');

    // },
};

