module.exports = {
  "siteKey": "JXIkEVhzIjhqR9bV2hPSr14svyzeMhVnbSuo0Fplkzyx2IEQfQW5YRBW25nb",
  "mssql": {
    "user": 'sa',
    "password": 'Wapro3000',
    "server": 'serwer',
    "database": 'HCLIFT_M_F',
    "pool": {
      "max": 10,
      "min": 0,
      "idleTimeoutMillis": 30000
    },
    "options": {
      "encrypt": false
    }
  }
};

module.exports.logs = function () {
  Array.prototype.unshift.call(arguments, '[' + new Date().toLocaleString() + ']');
  return console.log.apply(this, arguments);
}