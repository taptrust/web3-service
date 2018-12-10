'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAccount = exports.getUsers = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var createAccount = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(username, publicKey) {
    var accounts, result, contractAddress, user;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return web3.eth.getAccounts();

          case 2:
            accounts = _context.sent;


            console.log(ProxyWalletBytecode);

            _context.next = 6;
            return new web3.eth.Contract(ProxyWalletABI).deploy({
              data: ProxyWalletBytecode,
              arguments: [['0x0eEB66338d9672Ba67a4342ECE388E4026f9b43d'], username, publicKey]
            }).send({ gas: '1000000', from: accounts[0] });

          case 6:
            result = _context.sent;


            console.log('Contract created at address: ' + result.options.address);

            contractAddress = result.options.address;
            _context.next = 11;
            return saveAccountAddress(username, contractAddress);

          case 11:
            user = _context.sent;
            return _context.abrupt('return', user);

          case 13:
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Datastore = require('@google-cloud/datastore');
var web3 = require('./web3interface').web3;

var fs = require('fs');
var ProxyWallet = JSON.parse(fs.readFileSync('./contracts/ProxyWallet.json', 'utf8'));
var ProxyWalletABI = ProxyWallet['abi'];
var ProxyWalletBytecode = JSON.stringify(ProxyWallet['bytecode']);

var myContract = new web3.eth.Contract(ProxyWalletABI, {
  from: '0x0eEB66338d9672Ba67a4342ECE388E4026f9b43d',
  gas: '15000000',
  gasPrice: 20000000000
});

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
//# sourceMappingURL=account.js.map