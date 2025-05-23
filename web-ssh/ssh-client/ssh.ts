import { logger } from '../logger/logger.js';

export class SSHConn {
    user: string = "";
    hostname: string = "";
    password: string = "";
    command: string [] = [];

    constructor(
        user: string,
        hostname: string,
    ) {
        this.user = user;
        this.hostname = hostname;
        this.command = this.build();
    } 

    build (): string [] {
        let args: string [] = [];
        const target = `${this.user}@${this.hostname}`;
        args.push(target);
        logger.debug(`Command: ${args}`);
        return [...args];
    }

    getConfig(): Map<string, string> {
        // TODO: Will be useful for saving connections... future feature
        return new Map<string, string>;
    }

}