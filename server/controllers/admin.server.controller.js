'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 config = require(path.resolve('./config/config')),
 User = mongoose.model('User'),
 nodemailer = require('nodemailer'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
 exports.read = function (req, res) {
  res.json(req.model);
};


exports.invitedUser = function(req, res){

  console.log(req.params.userId);
  User.find({invitedBy: req.params.userId}, function (err, users) {
    if (!users) {
      return res.status(400).send({
        message: 'No account with that email has been found'
      });
    } else {

      res.json(users);
    }
  });
}

/**
 * Update a User
 */
 exports.update = function (req, res) {
  var user = req.model;

  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  console.log('-------------------');

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
 exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(user);
  });
};

/**
 * List of Users
 */
 exports.list = function (req, res) {

  // var transporter = nodemailer.createTransport({
  //   "type": "smtp",
  //   "host": "smtp.gmail.com",
  //   "secure": true,
  //   "port": 465,
  //   "tls": {
  //     "rejectUnauthorized": false
  //   },
  //   "auth": {
  //     "user": "turf.assistant.ron@gmail.com",
  //     "pass": "nothingface000"
  //   }

  // });

  var transporter = nodemailer.createTransport(config.gmail);

  // var transporter = nodemailer.createTransport({
  //   "type": "smtp",
  //   "host": "smtp.mandrillapp.com",
  //   "secure": true,
  //   "port": 587,
  //   "tls": {
  //     "rejectUnauthorized": false
  //   },
  //   "auth": {
  //     "user": "services@winetrakr.com",
  //     "pass": "lJKehfFkxKa4_vNqk4Do1A"
  //   }

  // });

  // var transporter = nodemailer.createTransport("SMTP", {
  //   host: "mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "949c33b85f-e2e43f@inbox.mailtrap.io",
  //     pass: "1158c7886a224e"
  //   }
  // });

  var mailOptions = {
    to: 'eaktadiur@gmail.com',
    from: 'hackathon@starter.com',
    subject: 'Reset your password on winetrakr Starter',
    text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
    'Please click on the following link, or paste this into your browser to complete the process: If you did not request this, please ignore this email and your password will remain unchanged.\n'
  };

  transporter.sendMail(mailOptions, function(err) {
    console.log('Message sent');
  });




  // var smtpTransport = nodemailer.createTransport(smtpTransport({
  //   host : "smtp.mandrillapp.com",
  //   secureConnection : false,
  //   port: 587,
  //   auth : {
  //     user : "services@winetrakr.com",
  //     pass : "lJKehfFkxKa4_vNqk4Do1A"
  //   }
  // }));

  // var mailOptions={
  //   from : "services@winetrakr.com",
  //   to : "eaktadiur@gmail.com",
  //   subject : "Your Subject",
  //   text : "Your Text",
  //   html : "HTML GENERATED",
  // }
  // console.log(mailOptions);

  // smtpTransport.sendMail(mailOptions, function(error, response){
  //   if(error){
  //     console.log(error);
  //     res.end("error");
  //   }else{
  //     console.log(response.response.toString());
  //     console.log("Message sent: " + response.message);
  //     res.end("sent");
  //   }
  // });



// create reusable transporter object using the default SMTP transport 

// var smtpConfig = {
//     host: 'smtp.mandrillapp.com',
//     port: 587,
//     secure: false, // use SSL 
//     auth: {
//         user: 'services@winetrakr.com',
//         pass: 'lJKehfFkxKa4_vNqk4Do1A'
//     }
// };

// var transporter = nodemailer.createTransport(smtpConfig);

// // setup e-mail data with unicode symbols 
// var mailOptions = {
//     from: 'services@winetrakr.com', // sender address 
//     to: 'eaktadiur@gmail.com', // list of receivers 
//     subject: 'Hello ✔', // Subject line 
//     text: 'Hello world 🐴', // plaintext body 
//     html: '<b>Hello world 🐴</b>' // html body 
//   };

// // send mail with defined transport object 
// transporter.sendMail(mailOptions, function(error, info){
//   if(error){
//     return console.log(error);
//   }
//   console.log('Message sent: ' + info.response);
// });




  // // Use Smtp Protocol to send Email
  // var smtpTransport = nodemailer.createTransport("SMTP",{
  //   service: "smtp.mandrillapp.com",
  //   auth: {
  //     user: "services@winetrakr.com",
  //     pass: "lJKehfFkxKa4_vNqk4Do1A"
  //   }
  // });

  // var mail = {
  //   from: "services@winetrakr.com",
  //   to: "eaktadiur@gmail.com",
  //   subject: "Send Email Using Node.js",
  //   text: "Node.js New world for me",
  //   html: "<b>Node.js New world for me</b>"
  // }

  // smtpTransport.sendMail(mail, function(error, response){
  //   if(error){
  //     console.log(error);
  //   }else{
  //     console.log("Message sent: " + response.message);
  //   }

  //   smtpTransport.close();
  // });


  // var message = {
  //   "html": "<p>Example HTML content</p>",
  //   "text": "Example text content",
  //   "subject": "example subject",
  //   "from_email": "services@winetrakr.com",
  //   "from_name": "Example Name",
  //   "to": [{
  //     "email": "eaktadiur@gmail.com",
  //     "name": "Demo",
  //     "type": "to"
  //   },
  //   {
  //     "email": "dipesh@truelancer.com",
  //     "name": "Demo",
  //     "type": "to"
  //   }],
  //   "headers": {
  //     "Reply-To": "reply@winetrakr.com"
  //   },
  //   "important": false,
  //   "track_opens": null,
  //   "track_clicks": null,
  //   "auto_text": null,
  //   "auto_html": null,
  //   "inline_css": null,
  //   "url_strip_qs": null,
  //   "preserve_recipients": null,
  //   "view_content_link": null,
  //   "bcc_address": "message.bcc_address@example.com",
  //   "tracking_domain": null,
  //   "signing_domain": null,
  //   "return_path_domain": null,
  //   "merge": true,
  //   "merge_language": "mailchimp",
  //   "global_merge_vars": [{
  //     "name": "merge1",
  //     "content": "merge1 content"
  //   }],
  //   "merge_vars": [{
  //     "rcpt": "recipient.email@example.com",
  //     "vars": [{
  //       "name": "merge2",
  //       "content": "merge2 content"
  //     }]
  //   }],
  //   "tags": [
  //   "password-resets"
  //   ],
  //   "subaccount": "customer-123",
  //   "google_analytics_domains": [
  //   "example.com"
  //   ],
  //   "google_analytics_campaign": "message.from_email@example.com",
  //   "metadata": {
  //     "website": "www.example.com"
  //   },
  //   "recipient_metadata": [{
  //     "rcpt": "recipient.email@example.com",
  //     "values": {
  //       "user_id": 123456
  //     }
  //   }],
  //   "attachments": [{
  //     "type": "text/plain",
  //     "name": "myfile.txt",
  //     "content": "ZXhhbXBsZSBmaWxl"
  //   }],
  //   "images": [{
  //     "type": "image/png",
  //     "name": "IMAGECID",
  //     "content": "ZXhhbXBsZSBmaWxl"
  //   }]
  // };



  // var async = false;
  // var ip_pool = "Main Pool";
  // var send_at = new Date();
  // mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
  //   console.log(result);
  //   /*
  //   [{
  //           "email": "recipient.email@example.com",
  //           "status": "sent",
  //           "reject_reason": "hard-bounce",
  //           "_id": "abc123abc123abc123abc123abc123"
  //       }]
  //       */
  //     }, function(e) {
  //   // Mandrill returns the error as an object with name and message keys
  //   console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
  //   // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
  // });


  // mandrill_client.users.ping({}, function(result) {
  //   console.log(result);
  // }, function(e) {
  //   // Mandrill returns the error as an object with name and message keys
  //   console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
  //   // A mandrill error occurred: Invalid_Key - Invalid API key
  // });





  User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
  });
};

/**
 * User middleware
 */
 exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};
