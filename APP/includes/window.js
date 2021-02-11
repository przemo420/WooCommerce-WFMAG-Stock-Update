const { ipcMain, app, BrowserWindow } = require('electron');

let mainWindow = allegroWindow = event = config = null;

class Window {
    constructor() {}

    init() {
        console.log( 'Window.init', app.isReady() );

        if( app.isReady() ) {
            if( mainWindow !== null ) {
                app.quit();
            }

            mainWindow = new BrowserWindow({ 
                width: 800, 
                height: 900, 
                maximizable: false, 
                resizable: true,
                webPreferences: {
                    nodeIntegration: false,
                    preload: __dirname + '\\html\\script.js'
                } });

            mainWindow.loadURL('file://' + __dirname + config.getValue( 'WINDOW_TEMPLATE' ) );

            mainWindow.on('closed', function () {
                mainWindow = null;
            });

            event.emit('window-start');
        }
    }

    allegro( url, cb ) {
        allegroWindow = new BrowserWindow({ width: 800, height: 900, maximizable: false, resizable: true });
        allegroWindow.loadURL( url );

        allegroWindow.on('closed', function () {
            allegroWindow = null;

            return cb(1);
        });
    }

    send(data, content) {
        if( mainWindow === null ) return;
        mainWindow.webContents.send(data, content);
    }

    info(message, clean = 0) {
        this.send('show-logs', { 'clean': clean, 'log': '[' + new Date().toLocaleString() + '] ' + message });
    }
}

ipcMain.on('load-done', function (e, arg) {
    event.emit('load-done');
});

ipcMain.on('do-update', function (e, arg) {
    event.emit('do-update', arg);
});

ipcMain.on('do-add', function (e, arg) {
    event.emit('do-add', arg);
});

ipcMain.on('do-remove', function (e, arg) {
    event.emit('do-remove', arg);
});

app.once('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

module.exports = function (cfg, e) {
    config = cfg;
    event = e;

    return new Window();
}