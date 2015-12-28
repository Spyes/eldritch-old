var mongoose = require('mongoose');
module.exports = mongoose.model('Other_World_Card', {
  name: String,
  number: Number,
  test: {}
});
