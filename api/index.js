module.exports = (env) => {
  const api = require('./router')();

  // router
  const router1 = initRouter(env, [
    './v1/barcode',
  ]);
  //
  // Mount
  api.use('/api', router1);

  return api;
};

// Helper to init routers
function initRouter(env, modules) {
  const router = require('./router')();
  modules.forEach(module => {
    require(module).init(env, router);
  });
  return router;
}
