const events = require('events'), event = new events.EventEmitter();

const config = require('./config.js');
const registry = require('./includes/registry.js')(config, event);
const mssql = require('./includes/mssql.js')(config, event);
const window = require('./includes/window.js')(config, event);
const request = require('./includes/request.js')(config, event);

const HOUR = 3600; // seconds

window.start();

event.on('window-start', function () {
    var time = HOUR;

    setInterval(function () {
        if (--time == 0) {
            event.emit('do-update', 'all');
            time = HOUR;
        }

        window.send('update-time', time);
    }, 1000);
});

event.on('show-info', function (data) {
    config.logs(data);
    window.info(data);
});

event.on('load-done', function () {
    registry.getSites(function (arr) {
        window.send('load-data', arr);
        window.info('Wczytano obsługiwane strony.');
    });
});

event.on('do-update', function (data) {
    window.info('Trwa odpytywanie zdalnego serwera..', true);

    if (data == 'all') {
        return window.info('Nie można odpytać wszystkich serwerów.');
    }

    registry.getSites(function (arr) {
        var option = arr[data];

        request.list(option.url, function (err, body) {
            if (err) {
                return window.info('Wystapił błąd z wysłaniem danych do serwera:' + err);
            }

            window.info('Nawiązywanie połączenia z bazą danych WF-MAG..');

            mssql.closeConnection();
            mssql.makeConnection(function (err) {
                if (err) return window.info(err, true);

                window.info('Przygotowanie tablicy z artykułami..');

                mssql.prepareRequest(body, function (body) {
                    window.info('Pobieranie artykułów z bazy danych WF-MAG..');

                    mssql.makeRequest(body, option.idMagazynu, function (err, art) {
                        if (err) return window.info(err, true);

                        window.info('Wysyłanie danych do ' + data + '.');

                        request.send(option.url, art, function (err, body) {
                            if (err) return window.info(err, true);

                            config.logs(body);

                            if (typeof body.ok !== 'undefined' && body.ok == 'done') {
                                window.info('Aktualizacja zakończona sukcesem');
                            } else {
                                window.info('Wystąpił błąd z aktualizacją: '+body)
                            }
                        });
                    });
                });
            });
        });
    });
});