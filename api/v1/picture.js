const picture = module.exports;

const dateFormat  = require('dateformat');
const exec        = require('child_process').exec;
const fs          = require('fs');
const mkdirp      = require('mkdirp-promise');

var picturePath;

// Init routes
picture.init = (env, router) => {
  picturePath = env.PICTURE_PATH;
  if (!fs.existsSync(picturePath)) {
    fs.mkdirSync(picturePath);
  }
  router.post('/picture', picture.takePicture.bind(this));
};

// Take picture, return path to picture
// body = {
//   directory: path,
//   base_name: name,
//   options: {
//     key: value
//   }
// }
picture.takePicture = (req) => {
  if (!req.body.directory) {
    throw new Error('request body needs directory');
  }

  let pathDir = picturePath + '/' + req.body.directory;
  let pathName;

  return mkdirp(pathDir) // returns Promise
  .then((data) => { // data is not used here
    let nameBase = 'camera';
    if (req.body.name) {
      nameBase = req.body.name;
    }
    let d = new Date();
    let dateSuffix = dateFormat(d, 'hMMss');
    let name = nameBase + dateSuffix;
    pathName = pathDir + '/' + name;

    let options = '';
    if (req.body.options) {
      if (Object.keys(req.body.options).length > 0) {
        options += Object.keys(req.body.options).map (function(k) {
          let dashes = k.length <= 3 ? '-' : '--';
          return dashes + k + ' ' + req.body.options[k]; 
        }).join(' ');
      }
    }

    return new Promise((resolve, reject) => {
      exec (
        'raspistill ' + options + ' -o ' + pathName, function(err, data, stderr) {
          if (err) {
            reject(err.message);
          }   
          else {
            resolve(pathName);
          }   
        }   
      );  
    });
  });
};
