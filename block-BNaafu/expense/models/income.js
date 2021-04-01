var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var incomeSChema = new Schema(
  {
    source: String,
    amount: { type: Number, default: 0 },
    description: String,
    date: Date,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

var Income = mongoose.model('Income', incomeSChema);

module.exports = Income;
