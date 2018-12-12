const Web3 = require('web3');

const web3 = new Web3('https://ropsten.infura.io/v3/155f5547dd0e4ab09bded202e8bcc08a');
const signingAccount = web3.eth.accounts.privateKeyToAccount('0x943eed2a06c4ba5991cf724ead779bebca00a7e47d3f29a2a334c7447a763b95');//('0x' + process.env.TAPTRUST_PRIVATEKEY);

const fs = require('fs');
const ProxyWallet = JSON.parse(fs.readFileSync('./contracts/ProxyWallet.json', 'utf8'));
const ProxyWalletABI = ProxyWallet['abi'];

const FactoryAddress = '0x64edfe6555ffc7f4d69e217f24543894c9ee3f56'; 
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