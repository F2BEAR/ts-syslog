# TS-Syslog

![npm](https://img.shields.io/npm/v/ts-syslog)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/f2bear/ts-syslog/release)
![npm bundle size](https://img.shields.io/bundlephobia/min/ts-syslog)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Fully typed NodeJS Syslog Server for ESM, CJS and Typescript.

## Quick Start

##### Installation
```shell
$ npm install ts-syslog
```

##### Usage

```javascript
import SyslogServer from "ts-syslog";
const server = new SyslogServer();

server.on("message", (value) => {
    console.log(value.date);     // the date/time the message was received
    console.log(value.message);  // the syslog message
});

server.on("error", (err: SyslogError) => {
    console.error(err.message)
})

server.listen({port:514}, () => {
    console.log("Syslog listening on port 514")
});
```

## Functions

### listen([options], [callback])

- **options** [Object] - The options passed to the server. Supports the following properties:
    + port [Number] - The UDP port which will be used to listen.
    + address [String] - Optional - The address which will be used - Defaults to `"0.0.0.0"`.
- **callback** [Function] - Optional - Callback function called once the server starts.

> **Note**
>
>For more information on the options object, check NodeJS official [API documentation](https://nodejs.org/api/dgram.html#dgram_socket_bind_options_callback).

### close([callback])

- **callback** [Function] - Optional - Callback function called once the server socket is closed.

### isRunning()

The isRunning function is a synchronous function that returns a Boolean value indicating if the server is ready to receive syslog messages or not.

> **Note**
>
> - Both the start and close functions return Promises.

#### Callbacks

Both the `listening()` and `close()` functions callbacks are expected to only have the optional parameter which can be or error or null as, for example:

```javascript
// this is correct
server.close(() => {/** your code **/}) 

// this is also correct
server.close((err) => {/** your code **/})
```

## Events

- **start** - Fired once the server is ready to receive syslog messages.
- **stop** - Fired once the server is shutdown.
- **error** - Fired whenever an error occur, an error object is passed to the handler function.
- **message** - Fired once the server receives a syslog message.

## Types

- **SyslogOptions** - Contains the type definition for the parameter `options` from the `listen(options, callback)` function
- **SyslogMessage** - Type definition for the message sent on the `message` event
- **SyslogError** - The type definition for the errors returned by the `error` event

> You can check the examples at `./examples`