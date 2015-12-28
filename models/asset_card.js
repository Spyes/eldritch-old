var mongoose = require('mongoose');
module.exports = mongoose.model('Asset_Card', {
  name: String,
  value: Number,
  trait: String,
  effects: {
    during_encounter: {
      combat: {
	strength_modifier: Number,
	will_modifier: Number
      }
    }
  },
  sub_trait: String
});
