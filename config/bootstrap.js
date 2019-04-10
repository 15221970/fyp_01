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
    { "username": "admin", "password": "123456",  "email": "admin@admi.com","block":false},
    { "username": "user", "password": "123","email": "user@gmail.com","block":false },
    { "username": "testuser", "password": "123" ,"email": "testuse1234@hotmail.com","block":false}
  ];

  users.forEach(function (user) {

    user.password = bcrypt.hashSync(user.password, salt);

    User.create(user).exec(function (err, model) { });

  });

  var photos = [
    { "filename": "test_photo1.JPG", "fd": sails.config.appPath + '/assets/images/test_photo1.JPG', "username": "user","description": "This is test 1!" ,"locationName":"Renfrew Rd","lat":22.338403,"lng":114.18177100000003},
    { "filename": "test_photo2.JPG", "fd": sails.config.appPath + '/assets/images/test_photo2.JPG', "username": "user" ,"description": "This is test 2!","locationName":"Kowloon","lat":22.3185673,"lng":114.17960570000002},
    { "filename": "test_photo3.JPG", "fd": sails.config.appPath + '/assets/images/test_photo3.JPG', "username": "user" ,"description": "This is test 3!","locationName":"Kowloon","lat":22.3325509,"lng":114.17963020000002},
    { "filename": "test_photo4.JPG", "fd": sails.config.appPath + '/assets/images/test_photo4.JPG', "username": "user" ,"description": "This is test 4!","locationName":"Baptist University Road","lat":22.3356447,"lng":114.18293089999997},
    { "filename": "test_photo5.JPG", "fd": sails.config.appPath + '/assets/images/test_photo5.JPG', "username": "testuser" ,"description": "This is test 5!","locationName":"Kowloon","lat":22.3185673,"lng":114.17960570000002},
    { "filename": "test_photo6.JPG", "fd": sails.config.appPath + '/assets/images/test_photo6.JPG', "username": "testuser" ,"description": "This is test 6!","locationName":"Tsuen Wan","lat":22.3699122,"lng":114.11443059999999},
    { "filename": "test_photo7.JPG", "fd": sails.config.appPath + '/assets/images/test_photo7.JPG', "username": "testuser" ,"description": "This is test 7!","locationName":"Hong Kong","lat":22.2346359,"lng":114.17217460000006},
    { "filename": "test_photo8.JPG", "fd": sails.config.appPath + '/assets/images/test_photo8.JPG', "username": "testuser" ,"description": "This is test 8!","locationName":"Harbin","lat":45.803775,"lng":126.53496700000005}
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


        // photo.lat= null;
        // photo.lng=null;
       
        if (exifData) {
          if (exifData.image) {
            photo.Model = exifData.image.Model;
          }
          if(exifData.exif){
            photo.ExposureTime = exifData.exif.ExposureTime;
            photo.exifData =exifData.exif.FNumber;
            photo.ISO= exifData.exif.ISO;
            photo.DateTimeOriginal=exifData.exif.DateTimeOriginal;
            photo.MaxApertureValue=exifData.exif.MaxApertureValue;
            photo.FocalLength = exifData.exif.FocalLength;
          }

      }
      
        // photo.exifData = exifData;

        //     lng: photo.lng,
      //   var inputdata = {
      //     username:  photo.username,
      //     description: photo.description,
      //     filename: photo.filename,
      //     fd: photo.fd,
      //     Model:photo.exifData.image.Model,
      //     Model:photo.exifData.image.Model,
      //     ExposureTime:photo.exifData.exif.ExposureTime,
      //     FNumber: photo.exifData.exif.FNumber,
      //     ISO: photo.exifData.exif.ISO,
      //     DateTimeOriginal: photo.exifData.exif.DateTimeOriginal,
      //     MaxApertureValue:photo.exifData.exif.MaxApertureValue,
      //     FocalLength: photo.exifData.exif.FocalLength,
      //     lat: photo.lat,
      //     lng: photo.lng,
          
      // };

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
