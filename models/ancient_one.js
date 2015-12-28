var mongoose = require('mongoose');
module.exports = mongoose.model('Ancient_One', {
  name: String,
  doom: Number,
  mythos_deck: {
    stage_one: {
      green: Number,
      yellow: Number,
      blue: Number
    },
    stage_two: {
      green: Number,
      yellow: Number,
      blue: Number
    },
    stage_three: {
      green: Number,
      yellow: Number,
      blue: Number
    }
  },
  research_cards: [mongoose.Schema.Types.ObjectId]
});
