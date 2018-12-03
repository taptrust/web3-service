
const Datastore = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore({
  projectId: 'tap-trust',
  keyFilename: '../service_account.json'
  // service_account.json is not included in git repository
});



/**
 * Retrieve the latest 10 user records from the database.
 */
const getUsers = () => {
  const query = datastore.createQuery('User')
    .order('created', { descending: true })
    .limit(10);

  return datastore.runQuery(query)
    .then((results) => {
      const entities = results[0];
      return entities.map((entity) => `Username: ${entity.username}, Address: ${entity.contract_address}`);
    });
}

const saveAccountAddress = (username, contractAddress) => {
  // Right now the public key and username are already saved from the TapTrust python server.
  // Only the contract address needs to be saved at this time.
  const userKey = datastore.key(['User', username]);
  return new Promise(function(resolve, reject) {
    datastore.get(userKey).then(results => {
      const entity = results[0];
      entity.contract_address = contractAddress;
      datastore.upsert(entity).then(() => {
        // Entity updated successfully.
        console.log('successfuly saved address for ' + username);
        resolve(entity);
      });
    });
  });
};

async function createAccount(username, publicKey){
    // TODO: Use Infura to deploy user contract with specified username/publicKey
    // Also modify the line below to use the correct address for the deployed contract
    const contractAddress = '0x_test--' + username;
    const user = await saveAccountAddress(username, contractAddress);
    return user;
}



export {
    getUsers, createAccount
};
