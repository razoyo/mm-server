const barcode = module.exports;

// Init routes
barcode.init = (env, router) => {
  router.put('/barcode', barcode.toUPC.bind(this));
};

// From barcode, get UPC
barcode.toUPC = (req) => {
  return new Promise(function (resolve, reject) {
    if (true) {
      resolve('123456');
    }
    else {
      reject('Bad promise');
    }
  });
};

