import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const pino = require('pino');

const debugLevel = process.env.NODE_ENV === "dev" ? "debug" : "info";
export const logger = pino({
    name: "logger",
    level: debugLevel,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});