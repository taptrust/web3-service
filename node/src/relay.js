const Datastore = require('@google-cloud/datastore');
const web3interface = require('./web3interface');
const web3 = web3interface.web3;
const ProxyWalletABI = web3interface.ProxyWalletABI;
const signingAccount = web3interface.signingAccount;

// Creates a client
const datastore = new Datastore({
  projectId: 'tap-trust',
  keyFilename: 'service_account.json'
  // service_account.json is not included in git repository
});

async function relayMessageSave(username, signature, contractAddress, action, txParam, txHash) {
  const userKey = datastore.key(['User', username]);
  await datastore.get(userKey).then(results => {
      const entity = results[0];
      entity.txs = entity.txs || [];
	  entity.txs.push({
		  "action": action,
		  "txParams": txParams,
		  "signature": signature,
		  "txHash": txHash
	  });
      datastore.upsert(entity).then(() => {
        // Entity updated successfully.
        console.log('successfuly saved transaction record for ' + username);
        resolve(entity);
      });
    });
};

async function relayMessage(username, signature, contractAddress, action, txParams){
	var WalletContract = web3interface.getWalletContract(contractAddress);
	
	var receipt, error;
	var nextNonce = await WalletContract.methods.sendTransaction(
		nonce, txParams.gasPrice, txParams.gasLimit, txParams.to, 
		txParams.value, txParams.data, signature).send()
			.on('transactionHash', function(_txHash) { 
				relayMessageSave(username, signature, contractAddress, action, txParams, _txHash);} )
			.on('receipt', function(_receipt){ receipt = _receipt; })
			.on('error', function(_err,_receipt) { 
				error = _err;
				console.error(_err); 
				receipt = _receipt; });
	
    return {"receipt" : receipt, "error" : error };
}

export {
    relayMessage
};
