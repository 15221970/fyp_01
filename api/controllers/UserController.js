/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    create: function (req, res) {

        if (req.method == "POST") {

            var bcrypt = require('bcrypt');
            var salt = bcrypt.genSaltSync(10);
            const saltRounds = 10;
            var input = req.body;

            // if (input.password!=req.body.comfirm_pwd){
            //     return res.send("Two input password must be consistent!");
            // }



            console.log(input.username);
            User.findOne({ username: input.username }).exec(function (err, model) {
                console.log("model: " + model);
                if (model) {
                    return res.send("username has been used");
                }

                input.password = bcrypt.hashSync(input.password, saltRounds);

                var inputdata = {username: input.username, password: input.password, email: input.email };
                User.create(inputdata).exec(function (err, model2) {

                    console.log(model2);

                    // if (err && err.code == 'E_VALIDATION') {
                    //     return res.send("username has been used");
                    // }
                    return res.send("create successfully");
                });
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


    showUploadPhoto: function (req, res) {

        User.findOne(req.params.id).populateAll().exec(function (err, model) {

            return res.json(model);

        });
    },
};

