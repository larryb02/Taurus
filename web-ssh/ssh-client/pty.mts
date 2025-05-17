import * as pty from 'node-pty';
import { Socket } from 'socket.io';

export class Pty {
    // ptyId: number;
    readonly ptyProcess: pty.IPty;

    constructor(socket: Socket) {
        console.log(`spawning pty process`);
        this.ptyProcess = pty.spawn("bash", [], {
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
            console.log("user has disconnected from socket.");
            this.ptyProcess.kill();
        });
        this.ptyProcess.onExit((e) => {
            console.log(`Shell process terminated: ${e.exitCode}`);
        });

        console.log("Pty constructor end");
    }
}
// start pty function

