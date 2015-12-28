var mongoose = require('mongoose');
module.exports = mongoose.model('Research_Card', {
  ancient_one: String,
  tests: {
    city: {},
    wilderness: {},
    sea: {}
  }
});