import SyslogServer from "../lib/index.mjs";

const server = new SyslogServer();

server.on('message', (msg) => {
    console.log(msg);
});

server.on('error', (err) => {
    console.error(err)
})

server.listen({port:514},()=> {
    console.log('Server is running...')
});

setTimeout(() => {
    server.close(() => {
        console.log("Syslog has been closed.")
    })
}, 5000)