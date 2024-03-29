'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var games = require('./routes/games.js');

var app = express();
app.use(bodyParser.json());

app.use('/', express.static('public'));
app.use('/api/games', games);

var port = process.env.PORT || 8125;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
