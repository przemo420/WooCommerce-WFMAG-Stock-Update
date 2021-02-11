var express = require('express');
var router = express.Router();
var path = require('path');

const _currentDir = path.resolve( __dirname + '/../public/routes' );

router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now());
    next();
})

router.get('/', function (req, res) {
    res.sendFile( _currentDir + '/header.html' );
    res.sendFile( _currentDir + '/allegro-index.html' );
    res.sendFile( _currentDir + '/footer.html' );
})

router.get('/init', function (req, res) { 
    let accessToken = config.getValue( 'allegro.access_token' );
    let refreshTimeToken = config.getValue( 'allegro.refresh_time' );
    let currentTimestamp = getCurrentTimestamp();

    if( accessToken == '' ) {
        console.log( 'Brak tokena dostępu - generuję URL.' );

        allegro.getVerificationUri(function(err, data) {
            if( err ) {
                return res.status(200).send({ success: false, msg: err });
            }

            res.status(200).send({ success: true, auth: data });
        });
    } else if( currentTimestamp > refreshTimeToken ) {
        console.log( 'Wykryto PRZETERMINOWANY token dostępu.' );
        
        allegro.refreshAccessToken(function(){
        });
    } else {
        console.log( 'Wykryto PRAWIDŁOWY token dostępu.' );
    }
});

router.get('/load-orders', function (req, res ) {
    fs.readFile('orders.txt', 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }

        res.status(200).send({ success: true, orderList: JSON.parse( data ) });
    });
});

router.get('/refresh-orders', function (req, res ) {
    let accessToken = config.getValue( 'allegro.access_token' );

    $this.allegroGetOrders( accessToken, function( orderErr, orders ) {
        if( orderErr != null ) {
            return console.log( '[ERROR] klient.js request.allegroGetOrders:', orderErr );
        }

        let newestOffers = orders.events;//.reverse();

        //let order = orders.events[0];

        //console.log( 'allegroGetOrders', orders.events );
        /*console.log( 'lineItems', order.order.lineItems[0] );
        console.log( 'lineItems.offer', order.order.lineItems[0].offer );
        console.log( 'lineItems.price', order.order.lineItems[0].price );*/

        res.status(200).send({ success: true, orderList: newestOffers });
    });
});

router.post('/auth', function (req, res ) {
    let data = req.body;

    allegro.authSecondStep( data.code, function(data) {
        res.status(200).send( data );
    });
});

module.exports = router;