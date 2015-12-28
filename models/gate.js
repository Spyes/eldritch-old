var mongoose = require('mongoose');
module.exports = mongoose.model('Gate', {
  location: String,
  omen: String
});