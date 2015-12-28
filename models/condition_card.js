var mongoose = require('mongoose');
module.exports = mongoose.model('Condition_Card', {
  name: String,
  restrictions: {},
  encounter: {},
  action: {}
});
