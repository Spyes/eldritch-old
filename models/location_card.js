var mongoose = require('mongoose');
module.exports = mongoose.model('Location_Card', {
  continent: String,
  tests: {
    city: {},
    wilderness: {},
    sea: {}
  }
});
