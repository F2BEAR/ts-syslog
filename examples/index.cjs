"use strict";

const SyslogServer = require('../lib/index.js')

const server = new SyslogServer();

server.on('message', (msg) => {
    console.log(msg);
});

server.on('error', (err) => {
    console.error(err)
})

server.listen();

setTimeout(() => {
    server.close(() => {
        console.log("Syslog has been closed.")
    })
}, 5000)