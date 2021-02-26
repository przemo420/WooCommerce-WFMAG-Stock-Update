const express = require('express'),
    app = express(),
    events = require('events'), 
    event = new events.EventEmitter();
 
let emitterHandler = app.get( 'eventEmitter' );

if( typeof emitterHandler === 'undefined' ) {
    const app = express(), events = require('events'), event = new events.EventEmitter();

    emitterHandler = event;
    app.set( 'eventEmitter', emitterHandler );
}

module.exports = emitterHandler;