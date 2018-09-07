const async = require('async'),
    fs = require('fs'),
    mssql = require('mssql');

var config = {}, event = null;

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
        msreq.query('SELECT Nazwa1, NrKatalogowy, IloscDostepna FROM WIDOK_ARTYKUL WHERE idMagazynu = '+mag+' ORDER BY nrKatalogowy'); // or request.execute(procedure)

        var artykuly = {}, w_artykuly = {};

        msreq.on('row', function (row) {
            w_artykuly[row.NrKatalogowy] = true;
            if (typeof products[row.NrKatalogowy] === 'undefined') {
                if (row.IloscDostepna) {
                    event.emit('show-info', 'Brak artykułu: ' + row.Nazwa1 + ' [ ' + row.NrKatalogowy + ' ] Ilość:' + row.IloscDostepna);
                }

                return;
            }

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

module.exports = function (cfg, e) {
    config = cfg;
    event = e;
    return new SQLRequest();
}