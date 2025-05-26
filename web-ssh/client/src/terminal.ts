import { Terminal } from '@xterm/xterm';
import { Socket } from 'socket.io-client';
import { socket } from './socket';
export class TerminalHandler {
    readonly term: Terminal;
    readonly socket: Socket;
    private _destination: string;

    constructor(destination: string) {
        this.term = new Terminal();
        this.socket = socket;
        this._destination = destination

    }

    private registerEvents() {
        this.socket.on("connect", () => {
            // start of the handshake should emit event signaling start of session
            // react component will need to use this event to determine that terminal is still loading
            this.socket.emit("sessionData", this._destination);
            console.log(`Connected: ${this.socket.id}`);
        });
        this.term.onData(data => {
            console.log(`Sending input event: ${data}`);
            this.socket.emit("terminal:input", data);
        });

        this.socket.on("pty:output", (chunk) => {
            // console.log("Received data from pty", chunk);
            this.term.write(chunk);
        });

        this.socket.on("disconnect", () => {
            console.log(`Disconnected from Socket ${this.socket.id}`);
        });
    }

    public init() {
        this.socket.connect();
        const el = document.getElementById('terminal');
        if (el) {
            this.term.open(el);
        }
        this.registerEvents();
    }

    public dispose() {
        this.term.dispose();
        this.socket.disconnect();
    }
}