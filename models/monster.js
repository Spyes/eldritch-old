var mongoose = require('mongoose');
module.exports = mongoose.model('Monster', {
  name: String,
  horror: Number,
  strength_test: Number,
  damage: Number,
  toughness: Number
});