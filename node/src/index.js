// om namah shivay

const express = require('express');

const account= require('./account');

const app = express();


app.all('/createAccount', (req, res, next) => {
  let username = req.query.username;
  let publicKey = req.query.publicKey;
  account.createAccount(username, publicKey)
    .then((user) => {
      res.json({contractAddress: user.contract_address});
    })
    .catch(next);

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
