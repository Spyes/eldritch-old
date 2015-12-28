var mongoose = require('mongoose');
module.exports = mongoose.model('Mythos_Card', {
  name: String,
  color: String,
  actions: {
    advance_doom: Boolean,
    spawn_monsters: Boolean,
    clue: Boolean
  }
});