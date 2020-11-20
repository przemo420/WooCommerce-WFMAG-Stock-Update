module.exports = {
  "debug": true,
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
    },
    "port": 1433,
    "stream": false,
    "parseJSON": false
  },
  "allegro": {
    "client_id": "",
    "client_secret": ""
  },
  "autoUpdateTime": 3600,
  "orderList": {
    "host": "",
    "client": "",
    "secret": ""
  },
  "REQUEST_URL": '/wp-json/stany/v1/',
  "WINDOW_TEMPLATE": "/html/template.html"
};

module.exports.logs = function () {
  Array.prototype.unshift.call(arguments, '[' + new Date().toLocaleString() + ']');
  return console.log.apply(this, arguments);
}