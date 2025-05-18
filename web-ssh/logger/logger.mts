// test-log.js
// const pino = require('pino');
import pino from 'pino';

export const logger = pino({
    name: "logger",
    level: "info",
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
}); // default destination: process.stdout
// logger.info("This is info");
// console.log("This is a plain console.log");