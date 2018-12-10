const Datastore = require('@google-cloud/datastore');
const web3interface = require('./web3interface');
const web3 = web3interface.web3;
const ProxyWalletABI = web3interface.ProxyWalletABI;
const signingAccount = web3interface.signingAccount;
const FactoryContract = web3interface.FactoryContract;

// Creates a client
const datastore = new Datastore({
  projectId: 'tap-trust',
  keyFilename: 'service_account.json'
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
	var pubKey = web3.utils.hexToBytes(publicKey);
	
	var result; 
	
	await FactoryContract.methods.createNewWallet(pubKey).send()
		.on('receipt', function(receipt){
			result = receipt.events.WalletCreated.returnValues.wallet;
		});
	
	console.log('Contract created at address: ' + result);
	
    const contractAddress = result;
	
    const user = await saveAccountAddress(username, contractAddress);
    return user;
}

async function getUserNonce(contractAddress){
	var WalletContract = web3interface.getWalletContract(contractAddress);
	var nextNonce = await WalletContract.methods.nextNonce().call();
	
	return nextNonce;
}

export {
    getUsers, createAccount, getUserNonce
};
