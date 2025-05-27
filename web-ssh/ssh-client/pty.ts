import * as pty from 'node-pty';
import { Socket } from 'socket.io';
import { logger } from './logger/logger.js';
import { setTimeout } from 'node:timers';
import { SSHConn } from './ssh.js';

export class Pty {
    private ptyProcess: pty.IPty;
    ptyPID: number = -1;
    private readonly socket: Socket;

    constructor(socket: Socket, user: string, host: string) {
        this.socket = socket;
        this.ptyProcess = this.startPty();
        this.registerEvents();
        // this.ptyProcess = pty.spawn("ssh", [host], {
        //     name: 'xterm-color',
        //     cols: 80,
        //     rows: 30,
        //     cwd: process.env.HOME,
        //     env: process.env
        // });
        this.ptyPID = this.ptyProcess.pid;
        logger.debug(`process launched ${this.ptyPID}`);
    }

    private registerEvents() {
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
            logger.info(`Shell process [${this.ptyPID}] terminated`);
            this.socket.emit("sessionTerminated");
            // then remove reference gc should handle rest we'll see once we add multi-term support
        });
        this.socket.on("error", err => {
            logger.error(`Error ${err}`);
        });
    }
    private startPty(): pty.IPty {
        // 1. create connection string based on parameters
        // 2. spawn pty using generated command string
        // 3. if password required manually write it to pty
        const con = new SSHConn("dummy", "openssh-server");
        // con.build();
        logger.debug(con.command);
        let p = pty.spawn("ssh", con.command, {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME,
            env: process.env
        });
        logger.debug(`Created new pty process ${p.pid}`);
        return p;
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
                return ptyOutput;
            }
        }

        return null;
    }

    dispose() {
        // TODO: stub for session cleanup

    }
}

