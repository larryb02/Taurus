import { logger } from './logger/logger.js';

export class SSHConn {
    private _user: string = "";
    private _hostname: string = "";
    private _command: string [] = [];

    constructor(
        user: string,
        hostname: string,
    ) {
        this._user = user;
        this._hostname = hostname;
        this._command = this.build();
    } 

    private build (): string [] {
        let args: string [] = [];
        args.push("-p");    // hack for now
        args.push("2222");
        const target = `${this._user}@${this._hostname}`;
        args.push(target);
        logger.debug(`Command: ssh ${args}`);
        return args;
    }

    getConfig(): Map<string, string> {
        // TODO: Will be useful for saving connections... future feature
        return new Map<string, string>;
    }

    getCommand(): string [] {
        return this._command;
    }

}