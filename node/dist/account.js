'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getUserNonce = exports.createAccount = exports.getUsers = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var createAccount = function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(username, publicKey) {
		var pubKey, tx, signedTx, result, user;
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						pubKey = web3.utils.hexToBytes(publicKey);
						tx = {
							gas: web3.utils.toHex(3000000),
							to: FactoryAddress,
							data: FactoryContract.methods.createNewWallet(pubKey).encodeABI()
						};
						_context.next = 4;
						return signingAccount.signTransaction(tx);

					case 4:
						signedTx = _context.sent;

						console.log('Creating account with signing account ' + signingAccount.address);
						console.log('Creating account with factory address ' + FactoryAddress);
						console.log("Sending Raw Transaction: " + signedTx.rawTransaction);

						_context.next = 10;
						return new Promise(function (resolve, reject) {
							web3.eth.sendSignedTransaction(signedTx.rawTransaction).once('receipt', function (receipt) {
								var log = receipt.logs[0];
								var topic = log.topics[1];
								var address = "0x" + topic.substring(26);
								console.log("found address " + address);
								resolve(address);
							}).on('transactionHash', console.log);
						});

					case 10:
						result = _context.sent;


						console.log('Contract created at address: ' + result);

						tx = {
							gas: web3.utils.toHex(100000),
							to: result,
							value: web3.utils.toHex('10000000000000000')
						};

						_context.next = 15;
						return signingAccount.signTransaction(tx);

					case 15:
						signedTx = _context.sent;


						console.log("Sending Raw Transaction: " + signedTx.rawTransaction);

						_context.next = 19;
						return new Promise(function (resolve, reject) {
							web3.eth.sendSignedTransaction(signedTx.rawTransaction).once('receipt', function (receipt) {
								resolve();
							}).on('transactionHash', console.log).on('error', console.error);
						});

					case 19:
						_context.next = 21;
						return saveAccountAddress(username, result);

					case 21:
						user = _context.sent;
						return _context.abrupt('return', user);

					case 23:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function createAccount(_x, _x2) {
		return _ref.apply(this, arguments);
	};
}();

var getUserNonce = function () {
	var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(contractAddress) {
		var WalletContract, nextNonce;
		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						WalletContract = web3interface.getWalletContract(contractAddress);
						_context2.next = 3;
						return WalletContract.methods.nextNonce().call();

					case 3:
						nextNonce = _context2.sent;
						return _context2.abrupt('return', nextNonce);

					case 5:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function getUserNonce(_x3) {
		return _ref2.apply(this, arguments);
	};
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Datastore = require('@google-cloud/datastore');
var web3interface = require('./web3interface');
var web3 = web3interface.web3;
var ProxyWalletABI = web3interface.ProxyWalletABI;
var signingAccount = web3interface.signingAccount;
var FactoryContract = web3interface.FactoryContract;
var FactoryAddress = web3interface.FactoryAddress;

// Creates a client
var datastore = new Datastore({
	projectId: 'tap-trust',
	keyFilename: 'service_account.json'
	// service_account.json is not included in git repository
});

/**
 * Retrieve the latest 10 user records from the database.
 */
var getUsers = function getUsers() {
	var query = datastore.createQuery('User').order('created', { descending: true }).limit(10);

	return datastore.runQuery(query).then(function (results) {
		var entities = results[0];
		return entities.map(function (entity) {
			return 'Username: ' + entity.username + ', Address: ' + entity.contract_address;
		});
	});
};

var saveAccountAddress = function saveAccountAddress(username, contractAddress) {
	// Right now the public key and username are already saved from the TapTrust python server.
	// Only the contract address needs to be saved at this time.
	var userKey = datastore.key(['User', username]);
	return new Promise(function (resolve, reject) {
		datastore.get(userKey).then(function (results) {
			var entity = results[0];
			entity.contract_address = contractAddress;
			datastore.upsert(entity).then(function () {
				// Entity updated successfully.
				console.log('successfuly saved address for ' + username);
				resolve(entity);
			});
		});
	});
};

exports.getUsers = getUsers;
exports.createAccount = createAccount;
exports.getUserNonce = getUserNonce;
//# sourceMappingURL=account.js.map