'use strict';

/**
 * Module dependencies.
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller'),
  stripe = require('../controllers/stripe.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  // Single user routes
  app.route('/api/invited/users/:userId')
    .get(adminPolicy.isAllowed, admin.invitedUser);


  // Users collection routes
  app.route('/api/subscripe-card')
    .post(adminPolicy.isAllowed, stripe.subscripe);

    app.route('/api/package-change')
    .post(adminPolicy.isAllowed, stripe.chargeCard);

    

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
