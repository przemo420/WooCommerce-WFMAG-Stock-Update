const async = require('async'),
    mssql = require('mssql');

var config = {};

class SQLRequest {
    makeConnection(cb) {
        mssql.connect(config.mssql, function (err) {
            return cb(err);
        });

        mssql.on('error', function (err) {
            config.logs('mssql error!' + err);
        });
    }

    closeConnection() {
        mssql.close();
    }

    prepareRequest(products, cb) {
        var artykuly = {};

        async.forEachOf(products, function (value, key, callback) {
            artykuly[value.sku] = value.id;
            return callback(null);
        }, function (err) {
            return cb(artykuly);
        });
    }

    makeRequest(products, mag, cb) {
        const msreq = new mssql.Request();
        msreq.stream = true;
        msreq.query('SELECT NrKatalogowy, IloscDostepna FROM WIDOK_ARTYKUL WHERE idMagazynu = '+mag+' ORDER BY nrKatalogowy'); // or request.execute(procedure)

        var artykuly = {};

        msreq.on('row', function (row) {
            if (typeof products[row.NrKatalogowy] === 'undefined') return;

            artykuly[row.NrKatalogowy] = [products[row.NrKatalogowy], row.IloscDostepna];
        });

        msreq.on('error', function (err) {
            config.logs('Wystąpił błąd podczas pobierania artykułów z bazy danych:' + err);
        });

        msreq.on('done', function (result) {
            return cb(null, artykuly);
        });
    }
}

module.exports = function (cfg) {
    config = cfg;
    return new SQLRequest();
}