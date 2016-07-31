'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 User = mongoose.model('User'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


 var moment = require('moment');

 var stripe = (require('stripe'))('sk_test_eBck3X6bpvzEtm8kCChDTevZ');

/**
 * Update a Stripe
 */
 exports.subscripe = function (req, res) {

  return stripe.customers.create({
    card: req.body.token,
    email: req.body.stripeEmail
  }, function(err, customer){
    if (customer){

      User.findById(req.body.userId, function(err, user) {
        user.paymentMethods.name = req.body.name;
        user.paymentMethods.customer_id = customer.id;
        user.paymentMethods.exp_month = req.body.exp_month;
        user.paymentMethods.exp_year = req.body.exp_year;
        user.paymentMethods.last4 = req.body.last4;

        console.log(user);


        user.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
        });


      });
      return res.end(customer.id.toString());
    } else {
      return (res.status(400)).send(err.message);
    }
  });
};


/**
 * chargeCard a Stripe
 */
 exports.chargeCard = function (req, res) {

  var stripeToken = req.body.stripeToken;
  var userId = req.body.userId;

  User.findById(userId).populate('user', 'displayName').exec(function (err, user) {
    if (err) {
      return next(err);
    }

    var price;

    if(user.membership.package=='Gold'){
      price=9.00;
    }else if(user.membership.package=='Premium'){
      price=19.00;
    }

    stripe.charges.create({
     amount: parseInt(price),
     source: stripeToken, 
     currency: "usd",
     description: "Wine Trakr Pacakage Change Package",
     customer: user.paymentMethods.customer_id
   },function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      console.log('Erron on charge');
    }else{

      console.log(charge);


      var currentDate = moment().format("YYYY-MM-DD h:mm:ss");
      var previousDay = moment(currentDate, 'YYYY-MM-DD h:mm:ss').subtract(moment.duration(1, 'days')).format('YYYY-MM-DD h:mm:ss');
      var nextMonth = moment(previousDay, 'YYYY-MM-DD h:mm:ss').add(moment.duration(1, 'months')).format('YYYY-MM-DD h:mm:ss');


      user.membership.charge = parseInt(price/100);
      user.membership.start_date = currentDate;
      user.membership.end_date = nextMonth;
      user.membership.charge_date = currentDate;
      user.membership.status = "done";
      user.membership.charge_details = 'Wine Trakr Pacakage Change Package';

      user.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(user);
        }
      });
    }

  });

  });



};
