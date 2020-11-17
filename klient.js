const events = require('events'), event = new events.EventEmitter();

const config = require('./config.js');
const registry = require('./includes/registry.js')(config, event);
const mssql = require('./includes/mssql.js')(config, event);
const window = require('./includes/window.js')(config, event);
const request = require('./includes/request.js')(config, event);
const ws = require('./includes/ws.js')(config, event, request);

const updater = require('./includes/updater.js')(config, event, window, registry, request, mssql);
const invoices = require('./includes/invoices.js')(config, event, window, registry, request, mssql);

const HOUR = 3600 * 4; // seconds

window.start();

event.on('window-start', function () {
    var time = HOUR;

    /*request.allegro( function( err, auth ) {
        if( err ) {
            return console.log( err );
        }
        
        auth = JSON.parse( auth );
        window.allegro( auth.verification_uri_complete );
    });*/

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

event.on('do-remove', function (data) {
    registry.getSites(function (arr) {
        registry.removeSite(data, function(err){
            if( err ) {
                return window.info( err );
            }
        });
    });
});

event.on('do-add', function (data) {
    registry.addSite( data.id, data.protocol, data.mag, function(err){
        if( err ) {
            return window.info('Nie można dodać strony o identyfikatorze '+data.id);
        }
    });
});

event.on('do-update', function (data) {
    updater.sendData( data );
});