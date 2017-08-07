const camera = module.exports;

const exec        = require('child_process').exec;

var picturePath;

// Init routes
camera.init = (env, router) => {
  picturePath = env.PICTURE_PATH;
  router.get('/picture', camera.takePicture.bind(this));
};

// Take picture, return path to picture
camera.takePicture = (req) => {
  console.log('takePicture');
  return new Promise(function (resolve, reject) {
    exec (
      'raspistill -o ' + picturePath, function(err, data, stderr) {
        if (err) {
          reject(err.message);
        }   
        else {
          resolve(picturePath);
        }   
      }   
    );  
  }); 
};
