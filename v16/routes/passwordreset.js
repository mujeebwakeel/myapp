var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var async = require("async");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var crypto = require("crypto");

// forgot password
router.get('/forgot', function(req, res) { 
  if(req.user) {
    req.flash("message", "You are currently logged in");
    return res.redirect("/campgrounds");
}
  res.render('password/forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
          if (err || !user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    
    function(token, user, done) {
      var name = user.username ;
      var transporter = nodemailer.createTransport({
        service: 'Yahoo', 
        secure: true,
        auth: {
          user: process.env.GMAIL_ADDRESS,
          pass: process.env.GMAIL_PASS
        }
      });

      let MailGenerator = new Mailgen({
        theme: "default",
        product: {
          name: "whykaycamp",
          link: "https://whykaycamp.herokuapp.com/",
        },
      });

      let response = {
        body: {
          name,
          intro: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://whykaycamp.herokuapp.com/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n' ,
        },
      };
    
      let mail = MailGenerator.generate(response);
      

      var mailOptions = {
        to: user.email,
        from: process.env.GMAIL_ADDRESS,
        subject: 'Whykaycamp Password Reset',
        html: mail
      };
      transporter.sendMail(mailOptions, function(err) {
        if(!err) {
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        }
        
        done(err, 'done'); 
      });
    }
  ], function(err) {
    if (err) {
      req.flash("error", "E-mail not sent");
      return res.redirect('/forgot');
    }
    res.redirect('/forgot');
  });
});




router.get('/reset/:token', function(req, res) {
  if(req.user) {
    req.flash("message", "You are currently logged in");
    return res.redirect("/campgrounds");
}
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (err || !user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('password/reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (err || !user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/forgot');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            if(err){
              console.log(err);
            }else{
               user.resetPasswordToken = undefined;
               user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
            }
         })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('/reset/' + req.params.token);
        }
      });
    },
    function(user, done) {
      var name = user.username ;
      var transporter = nodemailer.createTransport({
        service: 'Yahoo', 
        secure: true,
        auth: {
          user: process.env.GMAIL_ADDRESS,
          pass: process.env.GMAIL_PASS
        }
      });

      let MailGenerator = new Mailgen({
        theme: "default",
        product: {
          name: "whykaycamp",
          link: "https://whykaycamp.herokuapp.com/",
        },
      });

      let response = {
        body: {
          name,
          intro: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n' ,
        },
      };
    
      let mail = MailGenerator.generate(response);

      var mailOptions = {
        to: user.email,
        from: process.env.GMAIL_ADDRESS,
        subject: 'Your password has been changed',
        text: mail
      };

      transporter.sendMail(mailOptions, function(err) {
        if(!err) {
          req.flash('success', 'Success! Your password has been changed.');
        }
        done(err);
      });
    }
  ], function(err) {
    if (err) {
      console.log(err);
      req.flash("error", "E-mail not sent");
      return res.redirect('/campgrounds');
    }
      res.redirect('/campgrounds');
  });
});



module.exports = router;