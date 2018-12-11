const Web3 = require('web3');

const web3 = new Web3(process.env.NODE_ADDRESS || 'https://ropsten.infura.io/v3/155f5547dd0e4ab09bded202e8bcc08a');
const signingAccount = web3.eth.accounts.privateKeyToAccount(process.env.TAPTRUST_PRIVATEKEY || '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3');

const fs = require('fs');
const ProxyWallet = JSON.parse(fs.readFileSync('./contracts/ProxyWallet.json', 'utf8'));
const ProxyWalletABI = ProxyWallet['abi'];

const FactoryAddress = process.env.WALLET_FACTORY || '0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f'; 
const WalletFactory = JSON.parse(fs.readFileSync('./contracts/WalletFactory.json', 'utf8'));
const WalletFactoryABI = WalletFactory['abi'];

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

export {
    web3, signingAccount, ProxyWalletABI, getWalletContract, FactoryContract
};