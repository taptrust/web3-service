// om namah shivay
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const account = require('./account');

const relay = require('./relay');
const app = express();


app.use(bodyParser.json({ type: 'application/json' }))


app.all('/createAccount', (req, res, next) => {
  let publicKey = req.query.publicKey;
  let username = req.query.username;
  account.createAccount(username, publicKey)
    .then((user) => {
      res.json({contractAddress: user.contract_address});
    })
    .catch(next);
});

app.post('/relayMessage', (req, res, next) => {
  let username = req.body.username;
  let signature = req.body.signature;
  let contractAddress = req.body.contractAddress;
  let action = req.body.action;
  let params = req.body.params;

  switch (action) {
    case 'sendTransaction':
      relay.relaySendTransactionMessage(username, signature, contractAddress, action, params)
        .then((result) => {
          res.json({result: result});
        });
      break; 
    default: 
      res.json({'error': 'Action not recognized: ' + action});
      break
  }
  
});

app.all('/getUsers', (req, res, next) => {
  account.getUsers()
    .then((users) => {
      res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send(`Last 10 users:\n${users.join('\n')}`)
        .end();
    })
    .catch(next);
});

app.all('/getTxInfo', (req, res, next) => {
	account.getUserNonce(req.query.address)
    .then((nonce) => {
		console.log(nonce);
		res.json({'nonce': nonce});
    })
    .catch(next);
});


app.get('/', (req, res, next) => {
    res.json({ 'message': 'hello world' });
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Node server listening on port ${port}`);
});
