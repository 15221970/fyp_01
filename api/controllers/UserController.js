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
                
                return res.redirect("user/welcome");
            });
        } else {
            return res.view('user/create');
        }
    },

    login: function (req, res) {

        if (req.method == "GET")
            return res.view('user/login');
        else {
            User.findOne({ username: req.body.username }).exec(function (err, user) {

                if (user == null)
                    return res.send("No such user");

                if (user.password != req.body.password)
                    return res.send("Wrong Password");

                console.log("The session id " + req.session.id + " is going to be destroyed.");

                req.session.regenerate(function (err) {

                    console.log("The new session id is " + req.session.id + ".");

                    req.session.username = req.body.username;

                    return res.view("user/home");

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

