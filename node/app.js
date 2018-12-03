// om namah shivay

const express = require('express');

const app = express();

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const Datastore = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore({
  projectId: 'tap-trust',
  keyFilename: '../service_account.json'
  // service_account.json is not included in git repository
});

app.use('/', (req, res, next) => {

  getUsers()
    .then((users) => {
      res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send(`Last 10 users:\n${users.join('\n')}`)
        .end();
    })
    .catch(next);

    //res.json({ 'message': 'hello world' });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Node server listening on port ${port}`);
});


/**
 * Retrieve the latest 10 user records from the database.
 */
function getUsers () {
  const query = datastore.createQuery('User')
    .order('created', { descending: true })
    .limit(10);

  return datastore.runQuery(query)
    .then((results) => {
      const entities = results[0];
      return entities.map((entity) => `Username: ${entity.username}`);
    });
}
