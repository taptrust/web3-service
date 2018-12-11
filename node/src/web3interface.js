const Web3 = require('web3');

const web3 = new Web3(process.env.NODE_ADDRESS);
const signingAccount = web3.eth.accounts.privateKeyToAccount('0x' + process.env.TAPTRUST_PRIVATEKEY);

const fs = require('fs');
const ProxyWallet = JSON.parse(fs.readFileSync('./contracts/ProxyWallet.json', 'utf8'));
const ProxyWalletABI = ProxyWallet['abi'];

const FactoryAddress = process.env.WALLET_FACTORY || '0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f'; 
const WalletFactory = JSON.parse(fs.readFileSync('./contracts/WalletFactory.json', 'utf8'));
const WalletFactoryABI = WalletFactory['abi'];

var transactionCount = -1;

const getWalletContract = function(contractAddress) {
	return new web3.eth.Contract(ProxyWalletABI, contractAddress,
	{
		from: signingAccount.address,
		gas: '1500000',
		gasPrice: 20000000000,
	});
}

const FactoryContract = new web3.eth.Contract(WalletFactoryABI, FactoryAddress,
	{
		from: signingAccount.address,
		gas: '1500000',
		gasPrice: 20000000000,
	});
	
async function nextNonce() {
	if(transactionCount < 0) {
		transactionCount = await web3.eth.getTransactionCount(signingAccount.address, "pending");
	}
	return transactionCount++;
}

export {
    web3, signingAccount, ProxyWalletABI, getWalletContract, FactoryContract, nextNonce
};