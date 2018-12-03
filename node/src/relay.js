
const Datastore = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore({
  projectId: 'tap-trust',
  keyFilename: '../service_account.json'
  // service_account.json is not included in git repository
});


const relayMessageSend = (username, message) => {
  // Right now the public key and username are already saved from the TapTrust python server.
  // Only the contract address needs to be saved at this time.
  const userKey = datastore.key(['User', username]);
  return new Promise(function(resolve, reject) {
    datastore.get(userKey).then(results => {
      const entity = results[0];
      // TODO: relay message to this contract address
      resolve({txhash: 'example-tx-hash'});
    });
  });
};

async function relayMessage(username, message){
    // TODO: Use Infura to relay message to the user's contract
    // also save results (tx hash, status) to datastore
    // There will need to be some process in the event of transaction failure.
    let result = await relayMessageSend(username, message);
    return result;
}



export {
    relayMessage
};
