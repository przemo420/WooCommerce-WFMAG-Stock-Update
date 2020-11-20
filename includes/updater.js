const async = require('async');

let config, event, window, registry, request, mssql, instance = null;

class US {
    constructor() {
        instance = this;
    }

    parseAndSendData( id, option, cb ) {
        let shopArticles;

        async.waterfall([
            function( callback ) {
                request.list( option.url + config.REQUEST_URL, function (err, body) {
                    if (err) return callback( 'Wystapił błąd z wysłaniem danych do serwera:' + err );

                    shopArticles = body;
                    window.info( 'Pobrano artykuły ze sklepu, trwa łączenie z MAGiem...' );
                    return callback(null);
                });
            },
            function( callback ) {
                window.info( 'Sprawdzanie aktualności danych..' );

                mssql.checkArticleFile( option.idMagazynu, function( needUpdate ){
                    if( !needUpdate ) return callback();

                    mssql.refreshProducts( option.idMagazynu, function(err){
                        if( err ) return callback( err );
                        
                        window.info( 'Aktualizuję dane o produktach..' );
                        return callback();
                    });
                });
            },
            function( callback ) {
                window.info( 'Przygotowuję dane..' );

                mssql.prepareRequest( shopArticles, option.idMagazynu, function(err, art){
                    if( err ) return callback( err, true );

                    return callback( null, art );
                });
            },
            function( art, callback ) {
                window.info('Wysyłanie danych do ' + option.url + '.');
                        
                request.send( option.url + config.REQUEST_URL, art, function (err, body) {
                    if (err) return callback(err, true);

                    if( config.debug ) {
                        console.log( 'console.log', body );
                        config.logs( 'config.logs', body );
                    }

                    if (typeof body.ok === 'undefined' || body.ok == 'done') {
                        return callback( 'Wystąpił błąd z aktualizacją: '+ JSON.stringify(body, null, 2) );
                    }

                    registry.setUpdateTime( id, function(err){
                        if( err ) return callback( err );

                        return callback( 'Aktualizacja zakończona sukcesem' );
                    } );
                });
            }
        ], function(err, result){
            if( err ) return cb( err, false );

            return cb( result, true );
        });
    }

    sendData( data ) {
        window.info('Trwa odpytywanie zdalnego serwera..', true);

        registry.getSites(function (arr) {
            if( data == 'all' ) {
                for( var i in arr ) {
                    var site = arr[i];

                    instance.parseAndSendData( i, site, function( err, clean=false ){
                        window.info( err, clean );
                    } );
                }
                console.log( arr );
            } else {
                instance.parseAndSendData( data, arr[data], function( err, clean=false ){
                    window.info( err, clean );
                } );
            }
        });
    }
}

module.exports = function (cfg, ev, win, reg, req, sql) {
    config = cfg;
    event = ev;
    window = win;
    registry = reg; 
    request = req;
    mssql = sql;

    return new US();
}