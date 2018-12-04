'use strict';

// om namah shivay

var express = require('express');
var bodyParser = require('body-parser');
var account = require('./account');

var relay = require('./relay');

var app = express();

app.use(bodyParser.json({ type: 'application/json' }));

app.all('/createAccount', function (req, res, next) {
  var username = req.query.username;
  var publicKey = req.query.publicKey;
  account.createAccount(username, publicKey).then(function (user) {
    res.json({ contractAddress: user.contract_address });
  }).catch(next);
});

app.post('/relayMessage', function (req, res, next) {
  var username = req.body.username;
  var message = req.body.message;
  relay.relayMessage(username, message).then(function (result) {
    res.json({ result: result });
  });
});

app.all('/getUsers', function (req, res, next) {
  account.getUsers().then(function (users) {
    res.status(200).set('Content-Type', 'text/plain').send('Last 10 users:\n' + users.join('\n')).end();
  }).catch(next);
});

app.get('/', function (req, res, next) {
  res.json({ 'message': 'hello world' });
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Node server listening on port ' + port);
});
//# sourceMappingURL=index.js.map