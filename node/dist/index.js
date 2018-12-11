'use strict';

// om namah shivay

var express = require('express');
var bodyParser = require('body-parser');
var account = require('./account');

var relay = require('./relay');
var app = express();

app.use(bodyParser.json({ type: 'application/json' }));

app.all('/createAccount', function (req, res, next) {
  var publicKey = req.query.publicKey;
  var username = req.query.username;
  account.createAccount(username, publicKey).then(function (user) {
    res.json({ contractAddress: user.contract_address });
  }).catch(next);
});

app.post('/relayMessage', function (req, res, next) {
  var username = req.query.username;
  var signature = req.query.signature;
  var contractAddress = req.query.contractAddress;
  var action = req.query.action;
  var txParams = req.query.txParams;

  relay.relayMessage(username, signature, contractAddress, action, txParams).then(function (result) {
    res.json({ result: result });
  });
});

app.all('/getUsers', function (req, res, next) {
  account.getUsers().then(function (users) {
    res.status(200).set('Content-Type', 'text/plain').send('Last 10 users:\n' + users.join('\n')).end();
  }).catch(next);
});

app.all('/getUserNonce', function (req, res, next) {
  account.getUserNonce(req.query.address).then(function (nonce) {
    console.log(nonce);
    res.json({ 'nonce': nonce });
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