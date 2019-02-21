/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    upload : function(req, res){
      req.file('file').upload({
        // Directory path where you want to save...
        dirname : ''
        
      },function(err, file){
        if(err) console.log(err);
        res.json({"status" : "file upload successfully" , "file" :file});
      });
    }
  
  };

