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
    { "username": "user", "password": "123", "id": 102 },
    { "username": "testuser", "password": "123", "id": 103 }
  ];

  users.forEach(function (user) {

    user.password = bcrypt.hashSync(user.password, salt);

    User.create(user).exec(function (err, model) { });

  });

  var photos = [
    { "id": 100001, "filename": "test_photo1.JPG", "fd": sails.config.appPath + '/assets/images/test_photo1.JPG', "username": "user","description": "This is test 1!" },
    { "id": 100002, "filename": "test_photo2.JPG", "fd": sails.config.appPath + '/assets/images/test_photo2.JPG', "username": "user" ,"description": "This is test 2!"},
    { "id": 100003, "filename": "test_photo3.JPG", "fd": sails.config.appPath + '/assets/images/test_photo3.JPG', "username": "user" ,"description": "This is test 3!"},
    { "id": 100004, "filename": "test_photo4.JPG", "fd": sails.config.appPath + '/assets/images/test_photo4.JPG', "username": "user" ,"description": "This is test 4!"},
    { "id": 100005, "filename": "test_photo5.JPG", "fd": sails.config.appPath + '/assets/images/test_photo5.JPG', "username": "testuser" ,"description": "This is test 5!"},
    { "id": 100006, "filename": "test_photo6.JPG", "fd": sails.config.appPath + '/assets/images/test_photo6.JPG', "username": "testuser" ,"description": "This is test 6!"},
    { "id": 100007, "filename": "test_photo7.JPG", "fd": sails.config.appPath + '/assets/images/test_photo7.JPG', "username": "testuser" ,"description": "This is test 7!"},
    { "id": 100008, "filename": "test_photo8.JPG", "fd": sails.config.appPath + '/assets/images/test_photo8.JPG', "username": "testuser" ,"description": "This is test 8!"}
  ];
 
  // photos.forEach(function (photo) {

  //   Photo.create(photo).exec(function (err, model) { });

  // });


  photos.forEach(function (photo) {
    var ExifImage = require('exif').ExifImage;
    try {
      new ExifImage({ image: photo.fd }, function (error, exifData) {
        if (error)
          console.log('Error: ' + error.message);
        // else
        //   console.log(exifData); // Do something with your data!

        photo.exifData = exifData;

        Photo.create(photo).exec(function (err, model) {

        });
      });
    } catch (error) {
      console.log('Error: ' + error.message);
    }
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
