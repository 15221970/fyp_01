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
        if (req.method === 'GET') {
            return res.view('photo/upload');
        }
        else {
            // Call to /upload via GET is error
            var uploadFile = req.file('photo');
            uploadFile.upload({ dirname: '../../assets/images' }, function onUploadComplete(err, files) {
                // Files will be uploaded to .tmp/uploads
                if (err) {
                    return res.serverError(err);  // IF ERROR Return and send 500 error with error
                }
                
                return res.json({
                    status: 200,
                    file: files
                });
            });
        }
    }
};

