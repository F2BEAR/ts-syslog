'use strict';

import { createSocket, Socket } from 'dgram';
import EventEmitter from 'events';

export type SyslogMessage = {
	date: Date;
	host: string;
	message: string;
	protocol: string;
};

export type SyslogError = {
	date: Date;
	message: string;
};

export type SyslofOptions = {
	port: number,
	address?: string
}

export default class SyslogServer extends EventEmitter {
	socket: Socket | null;
	address = '0.0.0.0';

	constructor() {
		super();
		this.socket = null;
	}

	listen(
		options: SyslofOptions,
		cb?: (error: SyslogError | null) => void ,
	) {
		return new Promise((resolve, reject) => {
			if (!options.address) {
				options.address = this.address;
			}

			if (!options.port || typeof options.port !== "number") {
				let errorObj = createErrorObject(
					'The port argument is mandatory and it must be a number.',
				);
				if (cb) cb(errorObj);
				reject(errorObj);
			}

			const addressRgx = /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/gm;

			if (!addressRgx.test(options.address)) {
				let errorObj = createErrorObject(
					'The provided address does not follow the IPv4 address format.',
				);
				if (cb) cb(errorObj);
				reject(errorObj);
			}

			if (this.isRunning()) {
				let errorObj = createErrorObject(
					'NodeJS Syslog Server is already running!',
				);
				if (cb) cb(errorObj);
				reject(errorObj);
			} else {
				this.socket = createSocket('udp4');

				// Socket listening handler
				this.socket.on('listening', () => {
					this.emit('start', this);
					if (cb) cb(null);
					resolve(this);
				});

				// Socket error handler
				this.socket.on('error', (err) => {
					let error = createErrorObject(`${err.message}`);
					this.emit('error', error);
				});

				// Socket message handler
				this.socket.on('message', (msg, remote) => {
					let message: SyslogMessage = {
						date: new Date(),
						host: remote.address,
						message: msg.toString('utf8'),
						protocol: remote.family,
					};
					this.emit('message', message);
				});

				// Socket close handler
				this.socket.on('close', () => {
					this.emit('stop');
				});

				this.socket.bind(options);
			}
		});
	}

	close(cb?: (error: SyslogError | null) => void) {
		return new Promise((resolve, reject) => {
			try {
				if (!this.socket) throw new Error();
				this.socket.close(() => {
					this.socket = null;
					if (cb) return cb(null);
					return resolve(this);
				});
			} catch (err) {
				let errorObj = createErrorObject(
					'NodeJS Syslog Server is not running!',
				);
				if (cb) return cb(errorObj);
				return reject(errorObj);
			}
		});
	}

	isRunning() {
		return this.socket !== null;
	}
}

function createErrorObject(message: string): SyslogError {
	return {
		date: new Date(),
		message: message,
	};
}
