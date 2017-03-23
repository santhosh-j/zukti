'use strict';

const service = require('./service');

/* app constructor function is exported */
module.exports = function() {
  let app = service.createApp();
  app = service.setupWebpack(app);
  app = service.setupStaticRoutes(app);
  app = service.setupMiddlewares(app);
  app = service.setupZuktiRoutes(app);
  service.setupMongooseConnections();
  // service.setupRedisStore();
  return app;
};
