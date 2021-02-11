const request = require('request');
const fs = require('fs');
var config = event = window = $this = null;

class Allegro {
    getVerificationUri( cb ) {
        $this.postHelper( 'https://allegro.pl/auth/oauth/device', function( err, auth ) {
            if( err ) {
                console.log( '[ERROR] klient.js request.allegro:', err );
                return cb( true );
            }

            if( typeof auth.device_code === 'undefined' || auth.device_code.length === 0 ) {
                console.log( 'authFirstStep', auth );
                window.info( 'Wystąpił błąd podczas łączenia z allegro, sprawdź logi.' );
                return cb( true );
             }

             let ret = { 'authNeed': true, 'authUrl': auth.verification_uri_complete, 'deviceCode': auth.device_code };
             return cb( null, ret );
         });
    }

    refreshAccessToken( cb ) {
        let token = config.getValue( 'allegro.refresh_token' );

        $this.postHelper( 'https://allegro.pl/auth/oauth/token?grant_type=refresh_token&refresh_token='+token, function( err, auth ){
            if( err != null ) {
                console.log( '[ERROR] allegro.js refreshAccessToken:', err);
                return cb( true );
            }

            if( typeof auth.allegro_api !== 'boolean' || !auth.allegro_api ) {
                console.log( '[ERROR] allegro.js refreshAccessToken:', auth );
                return cb( true );
            }

            let currentTimestamp = getCurrentTimestamp();

            config.setValue( 'allegro.access_token', auth.access_token );
            config.setValue( 'allegro.refresh_token', auth.refresh_token );
            config.setValue( 'allegro.refresh_time', currentTimestamp + auth.expires_in );

            return cb( null );
        });
    }

    authSecondStep( code, cb ) {
        $this.postHelper( 'https://allegro.pl/auth/oauth/token?grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Adevice_code&device_code='+code, function( checkErr, b ) {
            if( checkErr != null ) {
                return console.log( '[ERROR] klient.js request.allegroCheckLogged:', checkErr);
            }

            if( typeof b.allegro_api !== 'boolean' || !b.allegro_api ) {
                return console.log( 'authSecondStep', b );
            }

            let currentTimestamp = getCurrentTimestamp();

            console.log( 'authSecondStep', b );

            config.setValue( 'allegro.access_token', b.access_token );
            config.setValue( 'allegro.refresh_token', b.refresh_token );
            config.setValue( 'allegro.refresh_time', currentTimestamp + b.expires_in );
        });
    }

    allegroGetOrders( token, cb ) {
        let orderRequest = '';

       // if( typeof orderid !== 'undefined' ) {
        //    orderRequest = '&from=e9a407c2-55a8-11eb-a4fd-a94a35d37f1e';
        //}

        request.get( {
            url: 'https://api.allegro.pl/order/checkout-forms?type=READY_FOR_PROCESSING'+orderRequest,
            headers: {
                'Authorization': 'Bearer '+token,
                'Content-Type': 'application/vnd.allegro.public.v1+json'
            }
        }, function( err, res, body ) {
            if ( err )  {
                console.log( err );
                return cb(err);
            }

            body = JSON.parse(body).checkoutForms;
            fs.writeFileSync( "orders.txt", JSON.stringify(body,null,2) );
            return cb( null, body );
        });
    }

    postHelper( allegroUrl, cb ) {
        let base64 = new Buffer.from( config.getValue('allegro.client_id') + ':' + config.getValue('allegro.client_secret'), 'utf-8' ).toString('base64');

        config.debug( base64 );

        request.post( {
            url: allegroUrl, 
            headers: {
                'Authorization': 'Basic '+base64,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'client_id=' + config.getValue( 'allegro.client_id' )
        }, function( err, res, body ) {
            if (err) {
                console.log( 'postHelper', allegroUrl, err );
                return cb( err, null );
            }

            return cb( null, JSON.parse( body ) );
        });
    }
}

function getCurrentTimestamp() {
    return Math.floor( new Date().getTime() / 1000 );
}

module.exports = function (cfg, e, w) {
    config = cfg;
    event = e;
    window = w;

    $this = new Allegro();
    return $this;
}