//const app = express(), events = require('events'), event = new events.EventEmitter();
//app.set( 'eventEmitter', event );

const config = require('./config.js');
const event = require('./includes/events.js');
const registry = require('./includes/registry.js')(config, event);
const mssql = require('./includes/mssql.js')(config);
const window = require('./includes/window.js')(config, event);
const request = require('./includes/request.js')(config, event);
const allegro = require('./includes/allegro.js')(config, event, null);
const ws = require('./includes/ws.js')(config, event, request, allegro);

const updater = require('./includes/updater.js')(config, event, window, registry, request, mssql);
const invoices = require('./includes/invoices.js')(config, event, window, registry, request, mssql);

config.loadConfig( function( loaded ) {
    if( !loaded ) return;

    console.log( 'Config.loadConfig', loaded );

    window.init();
});

event.on('window-start', function () {
    var time = config.getValue( 'autoUpdateTime' );

    setInterval(function () {
        if (--time == 0) {
            event.emit('do-update', 'all');
            time = config.getValue( 'autoUpdateTime' );
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
    registry.removeSite(data, function(err){
        if( err ) {
            return window.info( err );
        }

        event.emit('load-done');
    });
});

event.on('do-add', function (data) {
    registry.addSite( data.id, data.protocol, data.mag, function(err){
        if( err ) {
            return window.info('Nie można dodać strony o identyfikatorze '+data.id);
        }

        event.emit('load-done');
    });
});

event.on('do-update', function (data) {
    updater.sendData( data );
});