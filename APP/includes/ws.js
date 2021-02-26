var express = require('express'), 
    app = express(),
    router = express.Router(),
    rateLimit = require("express-rate-limit"),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path'),
    _currentDir = __dirname + '/public/',
    config = event = request = allegro = null;

var routeAllegro = require( __dirname + '\\routes\\allegro.js' );

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 10000
});

app.set( "views", path.join(__dirname, "views") );
app.set( "view engine", "pug" );

app.use( bodyParser.json() ); // support json encoded bodies
app.use( bodyParser.urlencoded({ extended: true }) ); // support encoded bodies

app.use( '/', apiLimiter, router );
app.use( '/css', apiLimiter, express.static( _currentDir + 'css') );
app.use( '/js', apiLimiter, express.static( _currentDir + 'js') );
app.use( '/img', apiLimiter, express.static( _currentDir + 'img') );

app.use( '/allegro', routeAllegro );

router.all('/', apiLimiter, function (req, res, next) {
    res.sendFile( _currentDir + 'index.html' );
});

router.all('/get-order-list', apiLimiter, function (req, res, next) {
    var keys = { client: config.getValue( 'orderList.client' ), secret: config.getValue( 'orderList.secret' ) };

    request.getOrdersFromShop( config.getValue( 'orderList.host' ), keys, function( err, body ){
        if( err ) {
            return res.status(200).send({ success: 'false', message: err });
        }

        res.status(200).send({ success: 'true', orders: body });
    });
});

class WS {
    constructor() {
        app.listen(9000, '192.168.1.61');
    }
}

function getCurrentTimestamp() {
    return Math.floor( new Date().getTime() / 1000 );
}

module.exports = function (cfg, e, req, alle) {
    config = cfg;
    event = e;
    request = req;
    allegro = alle;

    return new WS();
}