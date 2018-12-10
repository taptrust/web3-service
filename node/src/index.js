// om namah shivay

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
  let username = req.query.username;
  let signature = req.query.signature;
  let contractAddress = req.query.contractAddress;
  let action = req.query.action;
  let txParams = req.query.txParams;
  
  relay.relayMessage(username, signature, contractAddress, action, txParams)
    .then((result) => {
      res.json({result: result});
    });
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

app.all('/getUserNonce', (req, res, next) => {
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
