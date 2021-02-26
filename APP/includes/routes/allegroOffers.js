const express = require('express'),
    router = express.Router(),
    path = require('path'),
    fs = require('fs'),
    _currentDir = path.resolve( __dirname + '/../public/routes' ),
    event = require('../events.js');

router.get('/', function (req, res) { 
    fs.readFile('offers.txt', 'utf8', function (err, data) {
        if (err) return console.log(err);
        
        res.render( "offer-list", { 
            'title': "Lista ofert Allegro",
            'offers': JSON.parse( data ) 
        } );
    });
});

router.get('/:offerid', function (req, res) { 
    console.log( 'emit event', 'mssql:offer:get');
    event.emit( 'mssql:offer:get', {
        'user': res,
        'offerid': req.params.offerid
    });

    /*res.render( "offer-desc", { 
        'title': "Lista ofert Allegro",
        'offers': JSON.parse( data ) 
    } );*/
});

router.get('/load', function (req, res ) {
    fs.readFile('offers.txt', 'utf8', function (err, data) {
        if (err) return console.log(err);

        res.status(200).send({ success: true, offerList: JSON.parse( data ) });
    });
});

router.get('/refresh', function (req, res ) {
    let accessToken = config.getValue( 'allegro.access_token' );
    let data = { token: accessToken };

    $this.allegroGetOffers( data, function( offerErr, offers ) {
        if( offerErr != null ) {
            return console.log( '[ERROR] klient.js request.allegroGetOffers:', offerErr );
        }

        res.redirect( '/allegro/offers/load' );
    });
});

function realizeEvents() {
    event.on( 'show', function(m){
        m.render( "offer-desc", { 
            'title': "Lista ofert Allegro",
            'offers': []
        } );
    });
}

module.exports = router;