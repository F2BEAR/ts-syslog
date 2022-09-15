import SyslogServer, {SyslogError} from '../lib/index.js'

const server = new SyslogServer();

server.on('message', (msg) => {
    console.log(msg);
});

server.on('error', (err) => {
    console.error(err)
})

server.listen({port: 514}, (err: SyslogError | null) => {
    if(err) return console.error(err.message)
    console.log('Server is running...')
});

setTimeout(() => {
    server.close(() => {
        console.log("Syslog has been closed.")
    })
}, 5000)