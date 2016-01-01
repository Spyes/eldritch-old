var express = require('express');
var path = require('path');
var app = express();
var db = require('mongoose');

app.set('port', 3000);
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

db.connect('mongodb://localhost:27017/eldritch');

var collections = {
  investigators: require('./models/investigator.js'),
  ancient_ones: require('./models/ancient_one.js'),
  mythos_cards: require('./models/mythos_card.js'),
  asset_cards: require('./models/asset_card.js'),
  locations: require('./models/location.js'),
  gate: require('./models/gate.js'),
  monsters: require('./models/monster.js'),
  other_words: require('./models/other_world_card.js'),
  location_cards: require('./models/location_card.js'),
  research_cards: require('./models/research_card.js'),
  condition_cards: require('./models/condition_card.js'),
  expedition_cards: require('./models/expedition_card.js')
};

app.get('/api/:coll', function (req, res) {
  collections[req.params.coll].find(function (err, coll) {
    if (err) { res.send(err); }
    res.json({status: 200, coll: coll});
  });
});

app.get('*', function (req, res) {
  res.render('index.html');
});

var server = app.listen(3000);
