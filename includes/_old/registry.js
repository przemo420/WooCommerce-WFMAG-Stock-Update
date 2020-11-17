const async = require('async'),
    regedit = require('regedit'),
    fs = require('fs');  

var config = {}, event = null;

class Registry {
    constructor() {}

    getSites(cb) {
        return cb( config.sites );
    }

    setSites(sites) {
        config.sites = sites;
    }

    checkRegistry(cb) {
        /*regedit.list('HKCU\\AktualizatorStanowMagazynowych', function (err, result) {
            return cb(err ? false : true, result);
        });*/
        return cb(err ? false : true, this.sites);
    }

    createRegistryDefault(cb) {
        /*regedit.createKey('HKCU\\AktualizatorStanowMagazynowych', function (err) {
            if (err) {
                event.emit('show-info', 'Nie można utworzyć rejestru HKCU\\AktualizatorStanowMagazynowych:'+err.toString());
                return cb(true);
            }

            return cb(null);
        });*/
        console.log( 'DEPRECATED:', 'createRegistryDefault' );
    }

    insertRegistry(cb) {
        /*regedit.putValue({
            'HKCU\\AktualizatorStanowMagazynowych': {
                'strony': {
                    value: [ this.sites ],
                    type: 'REG_SZ'
                }
            }
        }, function (err) {
            if (err) {
                event.emit('show-info', 'Nie można przypisać kluczy do utworzonego rejestru HKCU\\AktualizatorStanowMagazynowych:' + err.toString());
                return cb(true);
            }

            return cb(null);
        });*/

        fs.open('config.js', 'w', (err, fd) => {
            if (err) throw err;

            fs.appendFile(fd, JSON.stringify(config, null, 2), 'utf8', (err) => {
                fs.close(fd, (err) => {
                    if (err) throw err;
                });

                if (err) throw err;
            });
        });

        console.log( 'DEPRECATED:', 'insertRegistry' );
    }

    prepareRegistry(cb) {
        var $this = this;

        async.waterfall([
            function (callback) {
                $this.checkRegistry(function(exist, list) {
                    if (exist) return callback(null, list['HKCU\\AktualizatorStanowMagazynowych']); // klucz istnieje, przechodzimy dalej

                    $this.createRegistryDefault(function (err) {
                        if (err) return callback(err);

                        event.emit('show-info', 'Utworzono klucz rejestru.');
                        return callback(null, list);
                    });
                });
            },
            function (list, callback) {
                if (typeof list === 'object') return callback(null, list); // posiada wartości, przechodzimy dalej

                $this.insertRegistry(function (err) {
                    if (err) return callback(err);

                    event.emit('show-info', 'Dodano wpis(y) rejestru.');
                    return callback(null, "{ 'values': { 'strony': { 'value': "+defaultSite+" } } }");
                });
            },
            function (list, callback) {
                event.emit('show-info', 'Wczytano odpytywanie stron:'+list.values.strony.value);
                $this.setSites(JSON.parse(list.values.strony.value));
                return callback(null);
            }
        ], function (err, result) {
            if (err) {
                config.logs('prepareRegistry error:', err);
            }
            
            return cb(null);  
        });
    }

    setUpdateTime( site ) {
        if( typeof config.sites[ site ] === 'undefined') {
            config.sites[ site ] = { 'url': '-', 'lastUpdate': '-', 'idMagazynu': '150' };
        }
        config.sites[ site ].lastUpdate = (new Date()).toLocaleString();
        this.insertRegistry( function(){ });
    }
} 

module.exports = function (cfg, e) {
    config = cfg;
    event = e;

    var registry = new Registry();

    /*registry.prepareRegistry(function () { 
        //registry.setUpdateTime( 'indual' );
    });*/

    return registry;
}