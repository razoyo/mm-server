const session = module.exports;
const picture = require('./picture');

// Init routes
session.init = (env, router) => {
  router.delete('/session', session.resetSession.bind(this));
};

// Reset session
session.resetSession = (req) => {
  console.log('resetSession');
  return picture.deleteAllPictures();
};

