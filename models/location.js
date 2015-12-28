var mongoose = require('mongoose');
module.exports = mongoose.model('Location', {
  name: String,
  coords: String,
  continent: String,
  type: String,
  investigators: [],
  monsters: [],
  connections: {
    train: [String],
    ship: [String],
    uncharted: [String]
  },
  gate: Boolean,
  clue: Boolean,
  expedition_token: Boolean
});
