/**
 * PhotoController
 *
 * @description :: Server-side logic for managing Photos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    // upload: function (req, res) {
    //     if (req.session.username != undefined) {
    //         if (req.method == "POST") {

    //         User.create(req.body.User).exec(function (err, model) {
    //                 return res.send("Upload Created!");
    //             });
    //              } else return res.view('photo/upload');
    //              } else
    //         return res.view('user/login');

    // },

    //  
    upload: function (req, res) {
        if (req.session.username != undefined) {
            if (req.method == 'GET') {
                return res.view('photo/upload');
            }
            else {
                var uploadFile = req.file('photo[file]');
                // console.log(req.body);
                uploadFile.upload({ dirname: sails.config.appPath + '/assets/images' }, function onUploadComplete(err, files) {

                    if (err) {
                        return res.serverError(err);  // IF ERROR Return and send 500 error with error
                    }

                    console.log(files[0]);

                    files[0].username = req.session.username;
                    files[0].description = req.body['photo[description]'];

                    var ExifImage = require('exif').ExifImage;
                    try {
                        new ExifImage({ image: files[0].fd }, function (error, exifData) {
                            if (error)
                                console.log('Error: ' + error.message);
                            else
                                console.log(exifData); // Do something with your data!

                            files[0].exifData = exifData;

                            Photo.create(files[0]).exec(function (err, model) {
                                return res.json({
                                    status: 200,
                                    file: files
                                })
                            });
                        });
                    } catch (error) {
                        console.log('Error: ' + error.message);
                    }



                });
            }
        } else {
            return res.view('user/login');
        }

    }

};

