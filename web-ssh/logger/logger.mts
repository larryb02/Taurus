import pino from 'pino';
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