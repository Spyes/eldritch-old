var mongoose = require('mongoose');
module.exports = mongoose.model('Investigator', {
  name: String,
  occupation: String,
  //starting_location: Number,
  starting_items: {
    assets: [String],
    spells: [String],
    clue: Number
  },
  assets: [],
  conditions: [],
  health: Number,
  sanity: Number,
  lore: Number,
  influence: Number,
  observation: Number,
  strength: Number,
  will: Number
});
