const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    species: {
        type: String,
        required: true
    },
    purchaseDate: {
      type: Date,
      required: true
    },
    waterFrequency: {
      type: Number,
      required: true
    }
  }, 
  { timestamps: true }
);

module.exports = mongoose.model('Plant', userSchema);