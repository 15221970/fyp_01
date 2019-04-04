/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {


  // Load the bcrypt module
  var bcrypt = require('bcrypt');

  // Generate a salt
  var salt = bcrypt.genSaltSync(10);

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  var users = [
    { "username": "admin", "password": "123456", "id": 101 },
    { "username": "user", "password": "123", "id": 102 }
  ];

  users.forEach(function (user) {

    user.password = bcrypt.hashSync(user.password, salt);

    User.create(user).exec(function (err, model) { });

  });

  // // Load the bcrypt module
  // sails.bcrypt = require('bcrypt');

  // // Go through a series of rounds to give you a secure hash
  // const saltRounds = 10;

  // var users = [
  //   { "username": "admin", "password": "123456" },
  //   { "username": "boss", "password": "123456" }
  // ];

  // users.forEach(function (user) {

  //   user.password = sails.bcrypt.hashSync(user.password, saltRounds);

  //   User.create(user).exec(function (err, model) { });
  
  // });

    cb();
  };
