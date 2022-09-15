"use strict";

const SyslogServer = require('../lib/index.js');

const server = new SyslogServer();

server.on('message', (msg) => {
    console.log(msg);
});

server.on('error', (err) => {
    console.error(err)
})

server.listen({port:514},(err, d) => {
    if (err) console.error(err.message)
});

setTimeout(() => {
    server.close(() => {
        console.log("Syslog has been closed.")
    })
}, 5000)