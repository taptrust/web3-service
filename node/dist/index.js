'use strict';

// om namah shivay

var express = require('express');

var account = require('./account');

var app = express();

app.use('/', function (req, res, next) {

    res.json({ 'message': 'hello world' });
});

app.use('/createAccount', function (req, res, next) {});

app.use('/getUsers', function (req, res, next) {

    account.getUsers().then(function (users) {
        res.status(200).set('Content-Type', 'text/plain').send('Last 10 users:\n' + users.join('\n')).end();
    }).catch(next);
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Node server listening on port ' + port);
});
//# sourceMappingURL=index.js.map