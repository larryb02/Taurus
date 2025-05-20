import * as pty from 'node-pty';
import { Socket } from 'socket.io';
import { logger } from '../logger/logger.mts';

export class Pty {
    readonly ptyProcess: pty.IPty;

    constructor(socket: Socket, user: string, host: string, identity?: string) {
            logger.info("spawning pty process");
            this.ptyProcess = pty.spawn("ssh", [host], {
                name: 'xterm-color',
                cols: 80,
                rows: 30,
                cwd: process.env.HOME,
                env: process.env
            });
            this.ptyProcess.onData(chunk => {
                socket.emit("pty:output", chunk);
            });
            socket.on("terminal:input", (chunk) => {
                // console.log(`terminal:input event received: ${chunk}`);
                this.ptyProcess.write(chunk);
            });
            socket.on("disconnect", () => {
                logger.info(`User has disconnected from socket ${socket.id}`);
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
                    case 1:
                        logger.error(`Error spawning pty: Status Code: ${e.exitCode}, Signal: ${e.signal}`);
                        socket.emit("Error", {"Exit_Code": exitCode, "Signal": e.signal});
                        break;
                }
            });
            socket.on("error", err => {
                logger.error(`Error ${err}`);
            })
        }
}

