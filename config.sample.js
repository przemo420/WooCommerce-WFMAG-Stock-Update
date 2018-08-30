module.exports = {
  "siteKey": "someKey",
  "mssql": {
    "user": 'sa',
    "password": 'Wapro3000',
    "server": 'serwer',
    "database": 'database',
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