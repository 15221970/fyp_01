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
                //  console.log(req.body);
                uploadFile.upload({ dirname: sails.config.appPath + '/assets/images' }, function onUploadComplete(err, files) {

                    if (err) {
                        return res.serverError(err);  // IF ERROR Return and send 500 error with error
                    }

                    // console.log(files[0]);

                    files[0].username = req.session.username;
                    files[0].description = req.body['photo[description]'];
                    files[0].lat = req.body['photo[lat]'];
                    files[0].lng = req.body['photo[lng]'];

                    var path = require('path');

                    files[0].filename = path.basename(files[0].fd);
                    console.log('filename: ' + files[0].filename);


                    var ExifImage = require('exif').ExifImage;
                    try {
                        new ExifImage({ image: files[0].fd }, function (error, exifData) {
                            if (error) {
                                console.log('Error: ' + error.message);
                            } else
                                console.log(exifData); // Do something with your data!

                            files[0].exifData = exifData;

                            // var inputdata = {
                            //     username: files[0].username,
                            //     description: files[0].description,
                            //     filename: files[0].filename,
                            //     fd: files[0].fd,
                            //     Model:files[0].exifData.image.Model,
                            //     ExposureTime:files[0].exifData.exif.ExposureTime,
                            //     FNumber: files[0].exifData.exif.FNumber,
                            //     ISO: files[0].exifData.exif.ISO,
                            //     DateTimeOriginal: files[0].exifData.exif.DateTimeOriginal,
                            //     MaxApertureValue:files[0].exifData.exif.MaxApertureValue,
                            //     FocalLength: files[0].exifData.exif.FocalLength,
                            //     lat: files[0].lat,
                            //     lng: files[0].lng,
                                
                            // };
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

    },

    detail: function (req, res) {
        Photo.findOne(req.params.id).exec(function (err, photo) {
            console.log(req.params.id);
            return res.view('photo/detail', { 'photo': photo });
        });
    },



    search: function (req, res) {
        if (req.method == 'GET') {
            return res.view('photo/search');
        } else {
            console.log(req.body.search_user);
            Photo.find({username:req.body.search_user}).exec(function (err, photo) {
                return res.view('photo/showResult', { 'photo': photo });
            });
        }
    },
};