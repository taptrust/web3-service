'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
var Datastore = require('@google-cloud/datastore');

// Creates a client
var datastore = new Datastore({
  projectId: 'tap-trust',
  keyFilename: '../service_account.json'
  // service_account.json is not included in git repository
});

/**
 * Retrieve the latest 10 user records from the database.
 */
var getUsers = function getUsers() {
  var query = datastore.createQuery('User').order('created', { descending: true }).limit(10);

  return datastore.runQuery(query).then(function (results) {
    var entities = results[0];
    return entities.map(function (entity) {
      return 'Username: ' + entity.username;
    });
  });
};

exports.getUsers = getUsers;
//# sourceMappingURL=account.js.map