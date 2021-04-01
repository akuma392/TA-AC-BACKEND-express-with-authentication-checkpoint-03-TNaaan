var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var expenseSchema = new Schema(
  {
    category: String,
    description: String,
    amount: { type: Number, default: 0 },
    date: Date,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

var Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
