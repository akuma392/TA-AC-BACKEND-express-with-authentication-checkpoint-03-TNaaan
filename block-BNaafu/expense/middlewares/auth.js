var User = require('../models/user');

module.exports = {
  loggedInUser: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.redirect('/users/login');
    }
  },
  userInfo: (req, res, next) => {
    var userId = req.session && req.session.userId;
    var userpassport = req.session && req.session.passport;
    if (userId) {
      User.findById(
        userId,
        'name email age country avatar phone otp',
        (err, user) => {
          if (err) return next(err);
          if (!req.session.passport) {
            req.user = user;
          }
          res.locals.user = user;
          next();
        }
      );
    } else if (userpassport) {
      let id = req.session.passport.user;
      User.findById(id, (err, user) => {
        if (err) return next(err);

        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
};
