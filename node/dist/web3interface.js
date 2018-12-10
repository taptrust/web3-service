'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Web3 = require('web3');
var HDWalletProvider = require('truffle-hdwallet-provider');
process.env.TAPTRUST_PRIVATEKEY = '0x0eEB66338d9672Ba67a4342ECE388E4026f9b43d';

console.log(process.env.NODE_IP);

var web3 = new Web3(new HDWalletProvider(process.env.TAPTRUST_PRIVATEKEY, 'https://ropsten.infura.io/v3/155f5547dd0e4ab09bded202e8bcc08a'));

exports.web3 = web3;
//# sourceMappingURL=web3interface.js.map