var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var Expense = require('../models/expense');
var Income = require('../models/income');
var moment = require('moment');

router.get('/', (req, res, next) => {
  let userId = req.user.id;
  Income.find({ owner: userId }, (err, incomes) => {
    if (err) return next(err);
    // console.log(err, incomes, 'abhi');
    Expense.find({ owner: userId }, (err, expenses) => {
      if (err) return next(err);
      res.render('expense', {
        incomes: incomes,
        expenses: expenses,
        moment: moment,
      });
    });
  });
});

router.get('/add', (req, res, next) => {
  res.render('add');
});
router.get('/new', (req, res, next) => {
  res.render('newExpense');
});
router.get('/income/new', (req, res, next) => {
  res.render('newIncome');
});

router.post('/new', (req, res, next) => {
  req.body.owner = req.user.id;
  Expense.create(req.body, (err, expense) => {
    if (err) return next(err);
    res.redirect('/expense');
  });
});
router.post('/income/new', (req, res, next) => {
  req.body.owner = req.user.id;
  Income.create(req.body, (err, income) => {
    if (err) return next(err);
    res.redirect('/expense');
  });
});

// update expense & income

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Expense.findById(id, (err, expense) => {
    res.render('updateExpense', { expense: expense });
  });
});

router.get('/income/:id/edit', (req, res, next) => {
  let id = req.params.id;

  Income.findById(id, (err, income) => {
    res.render('updateIncome', { income: income });
  });
});

router.post('/income/:id/edit', (req, res, next) => {
  let id = req.params.id;

  Income.findById(id, (err, inc) => {
    console.log(req.body, 'requesttt');
    if (!req.body.date) {
      req.body.date = inc.date;
    }
    req.body.source = inc.source;
    console.log(req.body, 'updated');
    Income.findByIdAndUpdate(id, req.body, (err, income) => {
      res.redirect('/expense');
    });
  });
});
router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id;

  Expense.findById(id, (err, expense) => {
    if (!req.body.date) {
      req.body.date = expense.date;
    }

    req.body.category = expense.category;
    Expense.findByIdAndUpdate(id, req.body, (err, income) => {
      res.redirect('/expense');
    });
  });
});

// delete income & expense

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Expense.findByIdAndDelete(id, (err, expense) => {
    res.redirect('/expense');
  });
});
router.get('/income/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Income.findByIdAndDelete(id, (err, expense) => {
    res.redirect('/expense');
  });
});
module.exports = router;
