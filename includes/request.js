const request = require('request');
var config = event = null;

class Request {
    send(url, art, cb) {
        request.post(url + 'aktualizuj', { json: true, form: { api: config.siteKey, products: art } },
            function (err, res, body) {
                if (err) {
                    return cb(err);
                }

                return cb(null, body);
            });
    }

    list(url, cb) {
        request.post(url + 'produkty', { json: true, form: { api: config.siteKey } },
            function (err, res, body) {
                if (err) {
                    return cb(err);
                }
                
                return cb(null, body);
            });
    }
}

module.exports = function (cfg, e) {
    config = cfg;
    event = e;

    return new Request();
}