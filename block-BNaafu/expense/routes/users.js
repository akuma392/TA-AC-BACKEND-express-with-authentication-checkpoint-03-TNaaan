var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Expense = require('../models/expense');
var Income = require('../models/income');
var upload = require('../utils/multer');

function randomNumber() {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

router.get('/', (req, res, next) => {
  console.log(req.user.isEmailVerified, 'ababa');
  let randomOTP = randomNumber();
  let id = req.user._id;
  req.user.otp = randomOTP;
  User.findByIdAndUpdate(id, req.user, (err, user) => {
    console.log(user, req.user.isEmailVerified, 'otp');
    res.render('home');
  });
});

router.get('/signup', (req, res, next) => {
  var error = req.flash('error');
  res.render('signup', { error });
});
router.get('/login', (req, res, next) => {
  console.log(req.session);
  var error = req.flash('error');
  res.render('login', { error });
});

router.post('/signup', (req, res, next) => {
  console.log(req.body, '*************');
  var { email, password } = req.body;
  if (password.length <= 4) {
    req.flash('error', 'minimum password length should be 5');
    return res.redirect('/users/signup');
  }
  User.create(req.body, (err, user) => {
    if (err) next(err);
    res.redirect('/users/login');
  });
});
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email/password required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'User doesnt exist!! Please signup');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'password is incorrect');
        return res.redirect('/users/login');
      }

      req.session.userId = user.id;
      res.redirect('/expense');
    });
  });
});
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

router.get('/articles', (req, res, next) => {
  let id = req.user._id;
  Article.find({ author: id }, (err, articles) => {
    console.log(articles);

    res.render('myarticles', { articles: articles });
  });
});

router.get('/update', (req, res) => {
  res.render('updateUser');
});
router.post('/update', (req, res, next) => {
  let id = req.user.id;

  User.findByIdAndUpdate(id, req.body, (err, user) => {
    console.log(user, 'hhhhhhhhhhhh');
    res.redirect('/users');
  });
});

router.post('/avatar', upload.single('avatar'), (req, res, next) => {
  console.log(req.file, '**********');
  req.body.avatar = req.file.filename;
  let id = req.user._id;
  console.log(req.body, 'test');
  User.findByIdAndUpdate(id, req.body, (err, user) => {
    if (err) next(err);
    console.log('after update');
    res.redirect('/users');
  });
});
module.exports = router;
