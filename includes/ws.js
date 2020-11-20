var express = require('express'), 
    app = express(),
    router = express.Router(),
    _currentDir = __dirname + '/public/',
    config = event = request = null;

app.use( '/', router )
app.use( '/css', express.static( _currentDir + 'css') );
app.use( '/js', express.static( _currentDir + 'js') );
app.use( '/img', express.static( _currentDir + 'img') );

router.all('/', function (req, res, next) {
    res.sendFile( _currentDir + 'index.html' );
});

router.all('/get-order-list', function (req, res, next) {
    var keys = { client: config.orderList.client, secret: config.orderList.secret };

    request.getOrdersFromShop( config.orderList.host, keys, function( err, body ){
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

module.exports = function (cfg, e, req) {
    config = cfg;
    event = e;
    request = req;

    return new WS();
}