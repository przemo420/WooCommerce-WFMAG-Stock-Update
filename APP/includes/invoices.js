let config, event, window, registry, request, mssql, instance = null;

class Invoices {
    constructor() {
        instance = this;
    }
}

module.exports = function (cfg, ev, win, reg, req, sql) {
    config = cfg;
    event = ev;
    window = win;
    registry = reg; 
    request = req;
    mssql = sql;

    return new Invoices();
}