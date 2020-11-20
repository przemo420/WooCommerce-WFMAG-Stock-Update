const { ipcMain, app, BrowserWindow } = require('electron');
const config = require('../config');

let mainWindow = allegroWindow = event = null;

class Window {
    constructor() {}

    start() {
        app.once('ready', function () {
            mainWindow = new BrowserWindow({ width: 800, height: 900, maximizable: false, resizable: true });
            mainWindow.loadURL('file://' + __dirname + config.WINDOW_TEMPLATE);

            mainWindow.on('closed', function () {
                mainWindow = null;
            });

            event.emit('window-start');
        });
    }

    allegro( url ) {
        allegroWindow = new BrowserWindow({ width: 800, height: 900, maximizable: false, resizable: true });
        allegroWindow.loadURL( url );

        allegroWindow.on('closed', function () {
            mainWindow = null;
        });
    }

    send(data, content) {
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
    event = e;

    return new Window();
}