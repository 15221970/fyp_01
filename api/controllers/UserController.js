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

            if (input.password!=req.body.comfirm_pwd){
                return res.send("Two input password must be consistent!");
            }



            //console.log(input.username);
            User.findOne({ username: input.username }).exec(function (err, model) {
                //console.log("model: " + model);
                if (model) {
                    return res.send("username has been used");
                }

                input.password = bcrypt.hashSync(input.password, saltRounds);

                var inputdata = {
                    username: input.username,
                    password: input.password,
                    email: input.email,
                    block: false
                };
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
                if (user.block) {
                    return res.send("Account has been blocked");
                }


                if (!bcrypt.compareSync(req.body.password, user.password))
                    return res.send("Wrong Password");

                console.log("The session id " + req.session.id + " is going to be destroyed.");

                req.session.regenerate(function (err) {

                    console.log("The new session id is " + req.session.id + ".");
                    req.session.username = req.body.username;
                    // console.log("req.session.username is " + req.session.username + ".");
                    if (req.session.username == "admin")
                        return res.send("This is Admin!");

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


    welcome: function (req, res) {
        return res.view('user/welcome');
    },


    myprofile: function (req, res) {
        if (req.session.username != undefined) {
            const qPage = req.query.page || 1;

            Photo.find({ username: req.session.username })
                .paginate({ page: qPage, limit: 6 })
                .sort({ createdAt: 'DESC' })
                .exec(function (err, photo) {
                    Photo.count({ username: req.session.username }).exec(function (err, value) {
                        var pages = Math.ceil(value / 6);
                        return res.view('user/myprofile', { 'photo': photo, 'count': pages });
                    });
                });
        } else {
            return res.view('user/login');
        }
    },



    // showUploadPhoto: function (req, res) {

    //     User.findOne(req.params.id).populateAll().exec(function (err, model) {

    //         return res.json(model);

    //     });
    // },

    home: function (req, res) {
        const qPage = req.query.page || 1;

        Photo.find().paginate({ page: qPage, limit: 6 })
            .sort({ createdAt: 'DESC' })
            .exec(function (err, photo) {
                Photo.count().exec(function (err, value) {
                    var pages = Math.ceil(value / 6);
                    return res.view('user/home', { 'photo': photo, 'count': pages });
                });
            });
    },

    adminSearch: function (req, res) {
        console.log(req.query.search_button);
        const qPage = req.query.page || 1;
        User.find().paginate({ page: qPage, limit: 50 })
            .where({ username: { contains: req.query.search_button } })
            .exec(function (err, user) {
                 User.count({username:req.query.search_button}).exec(function (err, value) {
                    var pages = Math.ceil(value / 50);
                    
                return res.view('user/adminSearch', { 'user': user ,'count': pages});
            });
        });
    },

    // admin: function (req, res) {

    // User.find().exec(function (err, user) {
    //         return res.view('user/admin', { 'user': user });
    //     });
    // },

    admin: function (req, res) {
        const qPage = req.query.page || 1;


        User.find().paginate({ page: qPage, limit: 50 })
            .exec(function (err, user) {
                User.count().exec(function (err, value) {
                    var pages = Math.ceil(value / 50);
                    return res.view('user/admin', { 'user': user, 'count': pages });
                });
            });
    },


    profile: function (req, res) {

        const qPage = req.query.page || 1;


        console.log(req.params.id);

        Photo.find({ username: req.params.id })
            .paginate({ page: qPage, limit: 6 })
            .sort({ createdAt: 'DESC' })
            .exec(function (err, photo) {
                Photo.count({ username: req.params.id }).exec(function (err, value) {
                    User.findOne({ username: req.params.id }).exec(function (err, user) {
                        var pages = Math.ceil(value / 6);
                        return res.view('user/profile', { 'photo': photo, 'count': pages, 'user': user });
                    })


                });
            });
    },

    adminBlock: function (req, res) {

        User.findOne(req.params.id).exec(function (err, user) {
            if (user.block == true)
                user.block = false;
            else if (user.block == false)
                user.block = true
            user.save();
            return res.redirect("/user/admin");
        });
    },

    adminSearchBlock: function (req, res) {

        User.findOne(req.params.id).exec(function (err, user) {
            if (user.block == true)
                user.block = false;
            else if (user.block == false)
                user.block = true
            user.save();
            return res.redirect("/user/adminSearch");
        });
    },

};

