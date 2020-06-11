const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
      type: Date,
      required: true
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  }, 
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', userSchema);