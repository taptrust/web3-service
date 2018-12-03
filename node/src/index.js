// om namah shivay

const express = require('express');
const bodyParser = require('body-parser');
const account = require('./account');

const relay = require('./relay');

const app = express();

app.use(bodyParser.json({ type: 'application/json' }))


app.all('/createAccount', (req, res, next) => {
  let username = req.query.username;
  let publicKey = req.query.publicKey;
  account.createAccount(username, publicKey)
    .then((user) => {
      res.json({contractAddress: user.contract_address});
    })
    .catch(next);

});

app.post('/relayMessage', (req, res, next) => {
  let username = req.body.username;
  let message = req.body.message;
  relay.relayMessage(username, message)
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


app.get('/', (req, res, next) => {
    res.json({ 'message': 'hello world' });
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Node server listening on port ${port}`);
});
