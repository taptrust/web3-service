'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.relayMessage = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var relayMessage = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(username, message) {
    var result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return relayMessageSend(username, message);

          case 2:
            result = _context.sent;
            return _context.abrupt('return', result);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function relayMessage(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Datastore = require('@google-cloud/datastore');

// Creates a client
var datastore = new Datastore({
  projectId: 'tap-trust',
  keyFilename: '../service_account.json'
  // service_account.json is not included in git repository
});

var relayMessageSend = function relayMessageSend(username, message) {
  // Right now the public key and username are already saved from the TapTrust python server.
  // Only the contract address needs to be saved at this time.
  var userKey = datastore.key(['User', username]);
  return new Promise(function (resolve, reject) {
    datastore.get(userKey).then(function (results) {
      var entity = results[0];
      // TODO: relay message to this contract address
      resolve({ txhash: 'example-tx-hash' });
    });
  });
};

exports.relayMessage = relayMessage;
//# sourceMappingURL=relay.js.map