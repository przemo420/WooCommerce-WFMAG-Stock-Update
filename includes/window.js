const { ipcMain, app, BrowserWindow } = require('electron');

let mainWindow = event = null;

class Window {
    constructor() {}

    start() {
        app.once('ready', function () {
            mainWindow = new BrowserWindow({ width: 800, height: 800, maximizable: false, resizable: false });
            mainWindow.loadURL('file://' + __dirname + '/html/template.html');

            mainWindow.on('closed', function () {
                mainWindow = null;
            });

            event.emit('window-start');
        });
    }

    send(data, content) {
        mainWindow.webContents.send(data, content);
    }

    info(message, clean = 0) {
        this.send('show-logs', { 'clean': clean, 'log': '[' + new Date().toLocaleTimeString() + '] ' + message });
    }
}

ipcMain.on('load-done', function (e, arg) {
    event.emit('load-done');
});

ipcMain.on('do-update', function (e, arg) {
    event.emit('do-update', arg);
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