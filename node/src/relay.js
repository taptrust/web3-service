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

async function relayMessageSave(username, signature, contractAddress, action, params, txHash) {
  const userKey = datastore.key(['User', username]);
  await datastore.get(userKey).then(results => {
      const entity = results[0];
      entity.txs = entity.txs || [];
	  entity.txs.push({
		  "action": action,
		  "params": params,
		  "signature": signature,
		  "txHash": txHash
	  });
      datastore.upsert(entity).then(() => {
        // Entity updated successfully.
        console.log('successfully saved transaction record for ' + username);
        resolve(entity);
      });
    });
};

async function relaySendTransactionMessage(username, signature, contractAddress, action, txParams){
	var WalletContract = web3interface.getWalletContract(contractAddress);
	
	var tx = {
		gas:  web3.utils.toHex(3000000),
		to: contractAddress,
		gasPrice: web3.utils.toHex(new web3.utils.BN(txParams.gasPrice)),
		data: WalletContract.methods.sendTransaction(
			txParams.nonce, txParams.gasPrice, txParams.gasLimit, txParams.to, 
			txParams.value, txParams.data, signature).encodeABI()
	};
	
	var signedTx = await signingAccount.signTransaction(tx);
	
	console.log("Sending Raw Transaction: " + signedTx.rawTransaction);
	
	var receipt = await new Promise(function(resolve, reject) {
		web3.eth.sendSignedTransaction(signedTx.rawTransaction)
			.once('receipt', function(receipt){
				resolve(receipt);
			})
			.on('transactionHash', console.log)
			.on('error', reject);
	});
	
    return {"receipt" : receipt, "error" : error };
}

export {
    relaySendTransactionMessage
};
