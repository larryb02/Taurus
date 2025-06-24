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
        this._ptyProcess = this.startSession(credentials);
        if (this._ptyProcess === null) {
            logger.error(`Problem creating session`);
        }
        this.ptyPID = this._ptyProcess.pid;
        logger.debug(`process launched [${this.ptyPID}]`);
    }

    private registerEvents(proc: pty.IPty) {
        logger.debug("Registering events");
        proc.onData(chunk => {
            this._socket.emit("pty:output", chunk);
        });
        this._socket.on("terminal:input", (chunk) => {
            proc.write(chunk);
        });
        this._socket.on("disconnect", () => {
            logger.info(`User has disconnected from socket ${this._socket.id}`);
            proc.write('exit\r'); // needed for a clean exit from pty
            setTimeout(() => {
                proc.kill('SIGTERM');
            }, 300);
        });
        proc.onExit((e) => {
            const exitCode = e.exitCode;
            switch (exitCode) {
                case 0:
                    logger.info("Successfully terminated Pty");
                    break;
                default:
                    logger.error(`Error spawning pty: Status Code: ${e.exitCode}, Signal: ${e.signal}`);
                    this._socket.emit("err", { "Exit_Code": exitCode, "Signal": e.signal });
                    break;
            }
            logger.info(`Shell process [${this.ptyPID}] terminated`);
            this._socket.emit("sessionTerminated");
            // disposing registered events would probably be a good idea here
        });
        this._socket.on("error", err => {
            logger.error(`Error ${err}`);
        });
    }
    private startSession(credentials: Record<string, string>): pty.IPty {
        enum Startup {
            CONNECTING,
            SIGN_IN,
            AUTH_CHECK,
            READY
        }
        // STAGE 1: ATTEMPTING CONNECTION -> HERE WE CHECK FOR CONNECTION ERRORS
        // STAGE 2: ATTEMPT TO SIGN IN -> MUST CHECK FOR FAILURE HERE AS WELL
        // STAGE 3: SUCCESS -> CLEANUP EVENTS REGISTERED FOR PTY STARTUP AND REGISTER REGULAR SESSION EVENTS

        const { username, hostname, pw } = credentials;
        logger.debug(`Connecting with session credentials ${JSON.stringify(credentials)}`);
        const con = new SSHConn(username, hostname);
        const cmd = con.getCommand();
        logger.debug(cmd);

        let p = pty.spawn("ssh", cmd, {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME,
            env: process.env
        });

        logger.info(`Created new pty process [${p.pid}]`);
        // let registered: boolean = false;
        let step: Startup = Startup.CONNECTING;
        // consider buffering chunks now, and only clear buffer if we move steps
        let buffer = "";
        const ev = p.onData(chunk => {
            logger.debug(`Chunk: ${JSON.stringify(chunk)}`);
            p.pause();
            buffer += chunk;
            logger.debug(`Buffer: ${JSON.stringify(buffer)}`);
            switch (step) {
                case Startup.CONNECTING:
                    // check for connection errors, terminate if necessary
                    logger.debug("Current Step: CONNECTING");
                    const err = this.parseForErrors(buffer);
                    if (err) {
                        logger.warn(`Connection Failed ${err}`);
                        p.kill('SIGTERM');
                        ev.dispose();
                        return null;
                    }
                    // can fail with simple message for now, make verbose later
                    else {
                        buffer = "";
                        step = Startup.SIGN_IN;
                    }
                    break;
                case Startup.SIGN_IN:
                    // write password to pty (note, logic will definitely change 
                    //                          once i introduce identity files)
                    // check that authentication was successful if not terminate session
                    // (potentially implement retry logic in the future)
                    logger.debug("Current Step: SIGN IN");
                    if (buffer.toLowerCase().includes("password:")) {
                        logger.info("User is not signed in. Signing in.");
                        p.write(`${pw}\r`);
                    }
                    buffer = "";
                    step = Startup.AUTH_CHECK;
                    break;
                case Startup.AUTH_CHECK:
                    // check if it asks for password again
                    logger.debug("Current Step: AUTH CHECK");
                    if (buffer.toLowerCase().includes("try")) {
                        // sign in failed
                        logger.info("Failed to sign in terminating session.");
                        p.kill('SIGTERM');
                    }
                    if (buffer.toLowerCase().match(/[$#]\s*$/)) {
                        logger.info("Authentication successful. Entering shell.");
                        
                        // step = Startup.READY;
                        // p.write('\r');
                        this._socket.emit("success");
                        this._socket.emit("pty:output", buffer);
                        buffer = "";
                        this.registerEvents(p);
                        ex.dispose();
                        ev.dispose();
                    }
                    break;
                // case Startup.READY:
                //     logger.debug("Current Step: READY");
                //     logger.info(`ssh connection ready.`);
                //     // now we register events
                //     this.registerEvents(p);
                //     ev.dispose();
                //     break;
            }
            p.resume();
        });

        const ex = p.onExit(() => {
            logger.error("Something went wrong, terminating session");
            this._socket.emit("err");
            ex.dispose();
            ev.dispose();
        });
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

