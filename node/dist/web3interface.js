'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.nextNonce = exports.FactoryContract = exports.FactoryAddress = exports.getWalletContract = exports.ProxyWalletABI = exports.signingAccount = exports.web3 = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var nextNonce = function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						if (!(transactionCount < 0)) {
							_context.next = 4;
							break;
						}

						_context.next = 3;
						return web3.eth.getTransactionCount(signingAccount.address, "pending");

					case 3:
						transactionCount = _context.sent;

					case 4:
						return _context.abrupt('return', transactionCount++);

					case 5:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function nextNonce() {
		return _ref.apply(this, arguments);
	};
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Web3 = require('web3');

var web3 = new Web3('https://ropsten.infura.io/v3/155f5547dd0e4ab09bded202e8bcc08a');
var signingAccount = web3.eth.accounts.privateKeyToAccount('0x943eed2a06c4ba5991cf724ead779bebca00a7e47d3f29a2a334c7447a763b95'); //('0x' + process.env.TAPTRUST_PRIVATEKEY);

var fs = require('fs');
var ProxyWallet = JSON.parse(fs.readFileSync('./contracts/ProxyWallet.json', 'utf8'));
var ProxyWalletABI = ProxyWallet['abi'];

var FactoryAddress = '0xe70530198859bcbbd471aa86a93e05c4a4fd874c';
var WalletFactory = JSON.parse(fs.readFileSync('./contracts/WalletFactory.json', 'utf8'));
var WalletFactoryABI = WalletFactory['abi'];

var transactionCount = -1;

var getWalletContract = function getWalletContract(contractAddress) {
	return new web3.eth.Contract(ProxyWalletABI, contractAddress, {
		from: signingAccount.address,
		gas: '1500000',
		gasPrice: 20000000000
	});
};

var FactoryContract = new web3.eth.Contract(WalletFactoryABI, FactoryAddress, {
	from: signingAccount.address,
	gas: '1500000',
	gasPrice: 20000000000
});

exports.web3 = web3;
exports.signingAccount = signingAccount;
exports.ProxyWalletABI = ProxyWalletABI;
exports.getWalletContract = getWalletContract;
exports.FactoryAddress = FactoryAddress;
exports.FactoryContract = FactoryContract;
exports.nextNonce = nextNonce;
//# sourceMappingURL=web3interface.js.map