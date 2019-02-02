'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.relaySendTransactionMessage = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var relayMessageSave = function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(username, signature, contractAddress, action, params, txHash) {
		var userKey;
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						userKey = datastore.key(['User', username]);
						_context.next = 3;
						return datastore.get(userKey).then(function (results) {
							var entity = results[0];
							entity.txs = entity.txs || [];
							entity.txs.push({
								"action": action,
								"params": params,
								"signature": signature,
								"txHash": txHash
							});
							datastore.upsert(entity).then(function () {
								// Entity updated successfully.
								console.log('successfully saved transaction record for ' + username);
								resolve(entity);
							});
						});

					case 3:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function relayMessageSave(_x, _x2, _x3, _x4, _x5, _x6) {
		return _ref.apply(this, arguments);
	};
}();

var relaySendTransactionMessage = function () {
	var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(username, signature, contractAddress, action, txParams) {
		var WalletContract, tx, signedTx, receipt;
		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						WalletContract = web3interface.getWalletContract(contractAddress);
						tx = {
							gas: web3.utils.toHex(3000000),
							to: contractAddress,
							gasPrice: web3.utils.toHex(web3.utils.toBN(txParams.gasPrice)),
							data: WalletContract.methods.sendTransaction(txParams.nonce, txParams.gasPrice, txParams.gasLimit, txParams.to, txParams.value, txParams.data, signature).encodeABI()
						};
						_context2.next = 4;
						return signingAccount.signTransaction(tx);

					case 4:
						signedTx = _context2.sent;


						console.log('Relaying message with signing account ' + signingAccount.address);
						console.log('Relaying message with user contract address ' + contractAddress);

						console.log("Sending Raw Transaction: " + signedTx.rawTransaction);

						_context2.next = 10;
						return new Promise(function (resolve, reject) {
							web3.eth.sendSignedTransaction(signedTx.rawTransaction).once('receipt', function (receipt) {
								resolve(receipt);
							}).on('transactionHash', console.log).on('error', reject);
						});

					case 10:
						receipt = _context2.sent;
						return _context2.abrupt('return', { "receipt": receipt });

					case 12:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function relaySendTransactionMessage(_x7, _x8, _x9, _x10, _x11) {
		return _ref2.apply(this, arguments);
	};
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Datastore = require('@google-cloud/datastore');
var web3interface = require('./web3interface');
var web3 = web3interface.web3;
var ProxyWalletABI = web3interface.ProxyWalletABI;
var signingAccount = web3interface.signingAccount;

// Creates a client
var datastore = new Datastore({
	projectId: 'tap-trust',
	keyFilename: 'service_account.json'
	// service_account.json is not included in git repository
});

;

exports.relaySendTransactionMessage = relaySendTransactionMessage;
//# sourceMappingURL=relay.js.map