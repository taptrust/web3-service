const Web3 = require('web3');
const web3 = new Web3('https://web3.oasiscloud.io');
const signingAccount = web3.eth.accounts.privateKeyToAccount('0x5FE054F073B46FDC587125D25EE272AC6278FD8DCDB14792D6C7BF52636E597B');//('0x' + process.env.TAPTRUST_PRIVATEKEY);

const fs = require('fs');
const ProxyWallet = JSON.parse(fs.readFileSync('./contracts/ProxyWallet.json', 'utf8'));
const ProxyWalletABI = ProxyWallet['abi'];

const FactoryAddress = '0x670c562bdcac60256befae7f4534c99a10d32e72'; 
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
    web3, signingAccount, ProxyWalletABI, getWalletContract, FactoryAddress, FactoryContract, nextNonce
};
