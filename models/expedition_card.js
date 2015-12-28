var mongoose = require('mongoose');
module.exports = mongoose.model('Expedition_Card', {
  location: String,
  number: Number,
  test: {}
});
