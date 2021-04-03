var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const User = require('../models/user');
var bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  if (!req.user) {
    req.user = null;
    console.log(req.user, 'bbbbbbbbbbbbbbbbb');
  }
  console.log(req.user, 'aaaaaaaaaaaa');
  res.render('index', { user: req.user });
});

router.get('/failure', (req, res) => {
  res.render('failure');
});

router.get('/verify/otp', (req, res, next) => {
  var error = req.flash('error');
  res.render('verifyOtp', { error: error });
});

router.post('/verify/otp', (req, res, next) => {
  console.log(typeof Number(req.body.otp), typeof req.user.otp);
  if (Number(req.body.otp) == req.user.otp) {
    req.user.isEmailVerified = true;

    User.findByIdAndUpdate(req.user._id, req.user, (err, user) => {
      if (err) return next(err);
      res.redirect('/users');
    });
  } else {
    req.flash('error', 'otp is incorrect');
    res.redirect('/verify/otp');
  }
});

function randomNumber() {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

router.get('/send', (req, res) => {
  console.log(req.user.email, 'send mailll');
  const output = `${req.user.otp}`;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 3000,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: 'abhi.sonal9594@gmail.com', // sender address
    to: `${req.user.email}`, // list of receivers
    subject: 'Node otp ', // Subject line
    text: 'Hello world?', // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // res.render('contact', { msg: 'Email has been sent' });
    res.redirect('/verify/otp');
  });
});

router.get('/reset/link', (req, res, next) => {
  res.render('resetEmail');
});

router.get('/forgot', (req, res, next) => {
  var error = req.flash('error');
  res.render('newPassword', { error: error });
});

router.post('/forgot', (req, res, next) => {
  console.log(req.body, typeof req.body.newpassword);
  if (req.body.newpassword == req.body.confirmpassword) {
    console.log(req.body);
    let newData = {};
    newData.password = req.body.newpassword;
    // User.findOneAndUpdate(
    //   { email: req.body.newemail },
    //   req.newData,
    //   { upsert: true },
    //   (err, user) => {
    //     console.log(err, user, 'password Change');
    //   }
    // );
    User.findOne({ email: req.body.newemail }, (err, user) => {
      console.log(err, user, 'password change');
      bcrypt.hash(req.body.newpassword, 10, (err, hashed) => {
        if (err) next(err);
        user.password = hashed;
        user.save((err) => {
          console.log(err, user, 'new  password change');
          res.redirect('/users/login');
        });
      });
    });
  } else {
    console.log('password doesnt match');
    req.flash('error', 'both password doesnt match');
    res.redirect('/forgot');
  }
});

router.post('/reset/password', (req, res) => {
  let randomOtp = randomNumber();
  console.log(req.body.newemail, 'send mailll');
  const output = `${randomOtp}`;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 3000,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: 'abhi.sonal9594@gmail.com', // sender address
    to: `${req.body.newemail}`, // list of receivers
    subject: 'Node otp ', // Subject line
    text: 'Hello world?', // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // res.render('contact', { msg: 'Email has been sent' });
    res.render('verifyOtpEmail', { OTP: randomOtp });
  });
});

router.post('/verify/otp/:id', (req, res, next) => {
  let id = req.params.id;
  let otp = req.body.otp;
  if (id == otp) {
    res.redirect('/forgot');
  } else {
    req.flash('error', 'otp doesnt match');
    res.redirect('/users/login');
  }
});
module.exports = router;
