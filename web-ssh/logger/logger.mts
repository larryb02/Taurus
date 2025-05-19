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
});