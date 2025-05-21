import * as pty from 'node-pty';
import { Socket } from 'socket.io';
import { logger } from '../logger/logger.mts';
import { setTimeout } from 'node:timers';

export class Pty {
    private readonly ptyProcess: pty.IPty;
    readonly ptyPID: number
    private readonly socket: Socket;

    constructor(socket: Socket, user: string, host: string, identity?: string) {
        logger.info("spawning pty process");
        this.ptyProcess = pty.spawn("ssh", [host], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME,
            env: process.env
        });
        this.ptyPID = this.ptyProcess.pid;
        this.socket = socket;

        this.registerEvents();
    }

    private registerEvents() {
        // TODO: stub for registering event listeners
        this.ptyProcess.onData(chunk => {
            this.socket.emit("pty:output", chunk);
        });
        this.socket.on("terminal:input", (chunk) => {
            // console.log(`terminal:input event received: ${chunk}`);
            this.ptyProcess.write(chunk);
        });
        this.socket.on("disconnect", () => {
            logger.info(`User has disconnected from socket ${this.socket.id}`);
            // console.log("user has disconnected from socket.");
            this.ptyProcess.write('exit\r');
            setTimeout(() => {
                this.ptyProcess.kill('SIGTERM');
            }, 300);
        });
        this.ptyProcess.onExit((e) => {
            logger.info(`Shell process terminated: Status Code: ${e.exitCode}, Signal: ${e.signal}`);
            // console.log(`Shell process terminated: ${e.exitCode}, ${e.signal}`);
            const exitCode = e.exitCode;
            switch (exitCode) {
                case 0:
                    logger.info("Successfully terminated Pty");
                    break;
                default:
                    logger.error(`Error spawning pty: Status Code: ${e.exitCode}, Signal: ${e.signal}`);
                    this.socket.emit("Error", { "Exit_Code": exitCode, "Signal": e.signal });
                    break;
            }
        });
        this.socket.on("error", err => {
            logger.error(`Error ${err}`);
        });
    }
    private parseForErrors(ptyOutput: string): string | null {
        const errors: string[] = [
            'Could not resolve hostname',
            'Connection timed out',
            'Connection refused'
        ];

        for (const error of errors) {
            if (ptyOutput.includes(error)) {
                logger.debug(`SSH error found: ${error}`);
                return error;
            }
        }

        return null;
    }

    dispose() {
        // TODO: stub for session cleanup

    }
}

