import * as pty from 'node-pty';
import { Socket } from 'socket.io';
import { logger } from './logger/logger.js';
import { setTimeout } from 'node:timers';
import { SSHConn } from './ssh.js';

export class Pty {
    private _ptyProcess: pty.IPty;
    ptyPID: number = -1;
    private readonly _socket: Socket;

    constructor(socket: Socket, credentials: Record<string, string>) {
        this._socket = socket;
        this._ptyProcess = this.startPty(credentials);
        this.ptyPID = this._ptyProcess.pid;
        logger.debug(`process launched [${this.ptyPID}]`);
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
    private startPty(credentials: Record<string, string>): pty.IPty {
        // 1. create connection string based on parameters
        // 2. spawn pty using generated command string
        // 3. if password required manually write it to pty
        const {user, hostname, pass} = credentials;
        logger.debug(`Connecting with session credentials ${JSON.stringify(credentials)}`);
        const con = new SSHConn(user, hostname);
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
        let registered = false;
        const ev = p.onData(chunk => {
            p.pause();
            logger.debug(`Chunk: ${JSON.stringify(chunk)}`);
            // Note: this doesn't fully account for all cases yet, must improve
            if (chunk === "\r") {}
            else if (chunk.toLowerCase().includes("password:")) {
                logger.info("User is not signed in. Signing in.");
                p.write(`${pass}\r`);
            }
            else if (!chunk.toLowerCase().includes("permission denied")) { // very hacky, need a robust way to 
                                                                            // confirm sign in success or failure
                if (!registered) { // most likely wont need this flag if i parse this properly
                    logger.debug("Successfully signed in");
                    this.registerEvents(p);
                    registered = true;
                    ev.dispose(); // this is most likely the problem, should not dispose of this event until i've confirmed success
                }
            }
            else { // this will not execute properly until i fix the above ^
                // just terminate session for now tell user to try again
                logger.warn("Password is incorrect");
                // p.kill();
            }
            p.resume();
        });

        p.onExit(() => {
            logger.debug("Too many failed attempts connection closed.");
            // this._socket.emit("sessionTerminated");
        })

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

