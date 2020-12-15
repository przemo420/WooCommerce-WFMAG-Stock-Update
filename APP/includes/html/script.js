//if (window.module) module = window.module;

const DEBUG = true, cDOM = { 'updateAll': 'updateAll', 'content': 'content', 'logs': 'logs' };
var ipcRenderer = require('electron').ipcRenderer;

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        const $ = require('./jquery-3.3.1.slim.min.js');

        onStart();
    }
}

function onStart() {
    ipcRenderer.send('load-done', true);

    showUserNotification( 'Inicjalizacja aktualizatora stanów magazynowych zakończona pomyślnie.' );

    $('#content').on('click', 'a.update', function () {    
        ipcRenderer.send('do-update', $(this).attr('data-name'));
        return false;
    });
    
    $('#content').on('click', 'a.remove', function () {
        if( !confirm("Czy jesteś pewien?") ) return false;
    
        ipcRenderer.send('do-remove', $(this).attr('data-name'));
        return false;
    });
    
    $('#addSite').on('click', 'button.add', function () {
         ipcRenderer.send('do-add', { 'id': $('#siteID').val(), 'protocol': $('#sitePROT').val(), 'mag': $('#siteMAG').val() });
    });
}
    
ipcRenderer.on('show-logs', function (event, data) {
    if ( typeof data.clean !== 'undefined' && data.clean ) {
        document.getElementById( cDOM.logs ).innerHTML = '';
    }

    showUserNotification( data.log );

    document.getElementById( cDOM.logs ).innerHTML += data.log + "\n";
});

ipcRenderer.on('load-data', function (event, data) {
    const logName = 'ipcRenderer event (load-data):';
    var content = document.getElementById( cDOM.content );

    if( !content == null ) {
        return printErrorLog( logName, '#' + cDOM.content, 'nie istnieje!' );
    }

    if( DEBUG ) {
        printDebugLog( logName, data);
    }

    content.innerHTML = '';

    for (var i in data) {
        content.innerHTML += prepareSingleSiteList( i, data[i].lastUpdate );
    }

    content.innerHTML += prepareEndSiteList();
});

ipcRenderer.on('update-time', function (event, data) {
    const logName = 'ipcRenderer event (update-time):';
    var updateAll = document.getElementById( cDOM.updateAll );

    if( !updateAll ) {
        return printErrorLog( logName, '#' + cDOM.updateAll + ' nie istnieje!');
    }

    if( DEBUG ) {
        printDebugLog( logName, data);
    }

    updateAll.innerHTML = toTimeString(data);
});

function showUserNotification( text ) {
    let myNotification = new Notification( 'Aktualizator stanów magazynowych', {
        body: text
    });
}

function prepareSingleSiteList( itemid, itemLastUpdate ) {
    return `<div class="col-md-12">
    <div class="row">
        <div class="col-md-8">
            <div class="alert alert-dark" role="alert">
                Strona: <b>`+ itemid +`</b><br />
                Ostatnia aktualizacja: <b>`+ itemLastUpdate +`</b>
            </div>
        </div>
        <div class="col-md-4 text-right">
            <a href="#" data-name="`+ itemid +`" class="btn btn-info update">Aktualizuj</a>
            <a href="#" data-name="`+ itemid +`" class="btn btn-danger remove">Usuń</a>
        </div>
    </div>
</div>`;
}

function prepareEndSiteList( ) {
    return `<div class="col-md-12">
    <div class="row">
        <div class="col-md-10">
            <div class="alert alert-dark" role="alert">
                <b>Aktualizacja wszystkich stron</b>
            </div>
        </div>
        <div class="col-md-2 text-right">
            <a href="#" data-name="all" class="btn btn-primary update" id="`+ cDOM.updateAll +`">-</a>
        </div>
    </div>
</div>`;
}

function toTimeString(seconds) {
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}

function printDebugLog( logName, log ) {
    return console.warn( '[DEBUG]', logName, log );
}

function printErrorLog( logName, log ) {
    showUserNotification( '[ERROR]' + logName + log );

    return console.error( '[ERROR]', logName, log );
}