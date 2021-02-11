const async = require('async'),
    regedit = require('regedit'),
    fs = require('fs');  

var config = {}, event = null;

class Registry {
    constructor() {}

    getSites(cb) {
        return cb( config.getValue( 'sites' ) );
    }

    updateSites(cb) {
        /*fs.open('config.js', 'w', (err, fd) => {
            if (err) return cb(err);

            var text = 'module.exports =';
            text += JSON.stringify(config, null, 2);
            text += `;module.exports.logs = function () {Array.prototype.unshift.call(arguments, '[' + new Date().toLocaleString() + ']');return console.log.apply(this, arguments);}`;
            
            fs.appendFile(fd, text, 'utf8', (err) => {
                if (err) return cb(err);

                fs.close(fd, (err) => {
                    if (err) return cb(err);

                    event.emit('load-done');
                    cb(null);
                });
            });
        });*/
    }

    addSite( id, prot, mag, cb ) {
        if( config.isSiteExist( site ) ) return cb( 'Strona o podanym identyfikatorze [', site, '] już istnieje.' );

        config.insertSite( id, prot, mag, function(err){
            return cb( err );
        });
    }

    removeSite( site, cb ) {
        if( !config.isSiteExist( site ) ) return cb( 'Nie istnieje strona o tym identyfikatorze:', site );

        config.removeSite( site, function(err){
            return cb( err );
        });
    }

    setUpdateTime( site, cb ) {
        if( !config.isSiteExist( site ) ) return cb( 'Nie istnieje strona o tym identyfikatorze:', site );

        config.getValue( 'sites' )[ site ].lastUpdate = (new Date()).toLocaleString();

        this.updateSites(function(err){
            return cb( err );
        });
    }
} 

module.exports = function (cfg, e) {
    config = cfg;
    event = e;

    var registry = new Registry();
    return registry;
}