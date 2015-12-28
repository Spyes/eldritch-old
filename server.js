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

var Investigator = require('./models/investigator.js');
app.get('/api/investigators', function (req, res) {
  Investigator.find(function (err, investigators) {
    if (err) { res.send(err); }
    res.json({status: 200, investigators: investigators});
  });
});

var Ancient_One   = require('./models/ancient_one.js');
app.get('/api/ancient_ones', function (req, res) {
  Ancient_One.find(function (err, ancient_ones) {
    if (err) { res.send(err); }
    res.json({status: 200, ancient_ones: ancient_ones});
  });
});

var Mythos_Card = require('./models/mythos_card.js');
app.get('/api/mythos_cards', function (req, res) {
  Mythos_Card.find(function (err, mythos_cards) {
    if (err) { res.send(err); }
    res.json(mythos_cards);
  });
});

var Asset_Card = require('./models/asset_card.js');
app.get('/api/asset_cards', function (req, res) {
  Asset_Card.find(function (err, asset_cards) {
    if (err) { res.send(err); }
    res.json(asset_cards);
  });
});

var Location = require('./models/location.js');
app.get('/api/map_locations', function (req, res) {
  Location.find(function (err, locations) {
    if (err) { res.send(err); }
    res.json(locations);
  });
});

var Gate = require('./models/gate.js');
app.get('/api/gate_tokens', function (req, res) {
  Gate.find(function (err, gates) {
    if (err) { res.send(err); }
    res.json(gates);
  });
});

var Monster = require('./models/monster.js');
app.get('/api/monster_tokens', function (req, res) {
  Monster.find(function (err, gates) {
    if (err) { res.send(err); }
    res.json(gates);
  });
});

var OtherWorld = require('./models/other_world_card.js');
app.get('/api/other_world_cards', function (req, res) {
  OtherWorld.find(function (err, other_world_cards) {
    if (err) { res.send(err); }
    res.json(other_world_cards);
  });
});

var LocationCard = require('./models/location_card.js');
app.get('/api/location_cards', function (req, res) {
  LocationCard.find(function (err, location_cards) {
    if (err) { res.send(err); }
    res.json(location_cards);
  });
});

var ResearchCard = require('./models/research_card.js');
app.get('/api/research_cards', function (req, res) {
  ResearchCard.find(function (err, research_cards) {
    if (err) { res.send(err); }
    res.json(research_cards);
  });
});

var ConditionCard = require('./models/condition_card.js');
app.get('/api/condition_cards', function (req, res) {
  ConditionCard.find(function (err, condition_cards) {
    if (err) { res.send(err); }
    res.json(condition_cards);
  });
});

var ExpeditionCard = require('./models/expedition_card.js');
app.get('/api/expedition_cards', function (req, res) {
  ExpeditionCard.find(function (err, expedition_cards) {
    if (err) { res.send(err); }
    res.json(expedition_cards);
  });
});

app.get('*', function (req, res) {
  res.render('index.html');
});

var server = app.listen(3000);
