'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.relayMessage = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var relayMessageSave = function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(username, signature, contractAddress, action, txParam, txHash) {
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
								"txParams": txParams,
								"signature": signature,
								"txHash": txHash
							});
							datastore.upsert(entity).then(function () {
								// Entity updated successfully.
								console.log('successfuly saved transaction record for ' + username);
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

var relayMessage = function () {
	var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(username, signature, contractAddress, action, txParams) {
		var WalletContract, receipt, error, nextNonce;
		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						WalletContract = web3interface.getWalletContract(contractAddress);
						_context2.next = 3;
						return WalletContract.methods.sendTransaction(nonce, txParams.gasPrice, txParams.gasLimit, txParams.to, txParams.value, txParams.data, signature).send().on('transactionHash', function (_txHash) {
							relayMessageSave(username, signature, contractAddress, action, txParams, _txHash);
						}).on('receipt', function (_receipt) {
							receipt = _receipt;
						}).on('error', function (_err, _receipt) {
							error = _err;
							console.error(_err);
							receipt = _receipt;
						});

					case 3:
						nextNonce = _context2.sent;
						return _context2.abrupt('return', { "receipt": receipt, "error": error });

					case 5:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function relayMessage(_x7, _x8, _x9, _x10, _x11) {
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

exports.relayMessage = relayMessage;
//# sourceMappingURL=relay.js.map