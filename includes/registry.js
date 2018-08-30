const async = require('async'),
    regedit = require('regedit');

var config = {}, event = null;

class Registry {
    constructor() {
        this.sites = config.defaultSite;
    }

    getSites(cb) {
        return cb(this.sites);
    }

    setSites(sites) {
        this.sites = sites;
    }

    checkRegistry(cb) {
        regedit.list('HKCU\\AktualizatorStanowMagazynowych', function (err, result) {
            return cb(err ? false : true, result);
        });
    }

    createRegistryDefault(cb) {
        regedit.createKey('HKCU\\AktualizatorStanowMagazynowych', function (err) {
            if (err) {
                event.emit('show-info', 'Nie można utworzyć rejestru HKCU\\AktualizatorStanowMagazynowych:'+err.toString());
                return cb(true);
            }

            return cb(null);
        });
    }

    insertRegistry(cb) {
        regedit.putValue({
            'HKCU\\AktualizatorStanowMagazynowych': {
                'strony': {
                    value: [defaultSite],
                    type: 'REG_SZ'
                }
            }
        }, function (err) {
            if (err) {
                event.emit('show-info', 'Nie można przypisać kluczy do utworzonego rejestru HKCU\\AktualizatorStanowMagazynowych:' + err.toString());
                return cb(true);
            }

            return cb(null);
        });
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
} 

module.exports = function (cfg, e) {
    config = cfg;
    event = e;

    var registry = new Registry();
    registry.prepareRegistry(function () { });

    return registry;
}