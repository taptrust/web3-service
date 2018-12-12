'use strict';

// om namah shivay
require('dotenv').config();
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
  var username = req.body.username;
  var signature = req.body.signature;
  var contractAddress = req.body.contractAddress;
  var action = req.body.action;
  var params = req.body.params;

  switch (action) {
    case 'sendTransaction':
      relay.relaySendTransactionMessage(username, signature, contractAddress, action, params).then(function (result) {
        res.json({ result: result });
      });
      break;
    default:
      res.json({ 'error': 'Action not recognized: ' + action });
      break;
  }
});

app.all('/getUsers', function (req, res, next) {
  account.getUsers().then(function (users) {
    res.status(200).set('Content-Type', 'text/plain').send('Last 10 users:\n' + users.join('\n')).end();
  }).catch(next);
});

app.all('/getTxInfo', function (req, res, next) {
  account.getUserNonce(req.query.address).then(function (nonce) {
    console.log('got user nonce: ' + nonce);
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