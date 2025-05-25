import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const pino = require('pino');

const debugLevel = process.env.NODE_ENV === "dev" ? "debug" : "info";
const transports = [{
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }, {
        target: 'pino/file',
        options: {
            destination: 1
        }
    }];

export const logger = pino({
    name: "logger",
    level: "debug",
    transport: process.env.NODE_ENV === "dev" ? transports[0] : transports[1]
});