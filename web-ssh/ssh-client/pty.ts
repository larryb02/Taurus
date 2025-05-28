import * as pty from 'node-pty';
import { Socket } from 'socket.io';
import { logger } from './logger/logger.js';
import { setTimeout } from 'node:timers';
import { SSHConn } from './ssh.js';

export class Pty {
    private _ptyProcess: pty.IPty;
    ptyPID: number = -1;
    private readonly _socket: Socket;

    constructor(socket: Socket, user: string, host: string) {
        this._socket = socket;
        this._ptyProcess = this.startPty();
        // this.registerEvents();
        this.ptyPID = this._ptyProcess.pid;
        logger.debug(`process launched ${this.ptyPID}`);
    }

    private registerEvents(proc: pty.IPty) {
        logger.debug("Registering events");
        proc.onData(chunk => {
            this._socket.emit("pty:output", chunk);
        });
        this._socket.on("terminal:input", (chunk) => {
            // console.log(`terminal:input event received: ${chunk}`);
            proc.write(chunk);
        });
        this._socket.on("disconnect", () => {
            logger.info(`User has disconnected from socket ${this._socket.id}`);
            // console.log("user has disconnected from socket.");
            proc.write('exit\r');
            setTimeout(() => {
                proc.kill('SIGTERM');
            }, 300);
        });
        proc.onExit((e) => {
            // console.log(`Shell process terminated: ${e.exitCode}, ${e.signal}`);
            const exitCode = e.exitCode;
            switch (exitCode) {
                case 0:
                    logger.info("Successfully terminated Pty");
                    break;
                default:
                    logger.error(`Error spawning pty: Status Code: ${e.exitCode}, Signal: ${e.signal}`);
                    this._socket.emit("Error", { "Exit_Code": exitCode, "Signal": e.signal });
                    break;
            }
            logger.info(`Shell process [${this.ptyPID}] terminated`);
            this._socket.emit("sessionTerminated");
            // then remove reference gc should handle rest we'll see once we add multi-term support
        });
        this._socket.on("error", err => {
            logger.error(`Error ${err}`);
        });
    }
    private startPty(): pty.IPty {
        // 1. create connection string based on parameters
        // 2. spawn pty using generated command string
        // 3. if password required manually write it to pty
        const con = new SSHConn("dummy", "localhost");
        // con.build();
        logger.debug(con.command);
        let p = pty.spawn("ssh", con.command, {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME,
            env: process.env
        });
        logger.info(`Created new pty process [${p.pid}]`);
        let buffer = "";

        const ev = p.onData(chunk => {
            p.pause();
            logger.debug(`Chunk: ${chunk}`);
            // buffer += chunk;
            // logger.debug(`Buffer: ${buffer}`);
            if (!this.checkIfSignedIn(chunk)) {
                logger.info("User is not signed in. Signing in.");
                p.write(`password\r`);
                ev.dispose();
                this.registerEvents(p);
                // buffer = "";
                // check if successful -> potentially looping behavior
            }
            if (chunk.toLowerCase().includes("permission denied")) {
                logger.warn("Password is incorrect");
            }
            p.resume();
            // ev.dispose();
            // else {
            //     this.registerEvents(p);
            //     ev.dispose();
            // }
            // p.resume();
        });

        p.onExit(() => {
            logger.debug("Too many failed attempts connection closed.");
        })
        // logger.debug("Successfully signed in, registering events");


        return p;
    }

    private checkIfSignedIn(ptyOutput: string): boolean {
        const msg: string = "password";
        if (ptyOutput.includes(msg)) return false;

        return true;
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

