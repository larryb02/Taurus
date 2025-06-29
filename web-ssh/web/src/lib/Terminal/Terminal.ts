import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { socket } from './socket';
import type { Socket } from 'socket.io-client';

export default class TerminalTTY { // Rename because of type conflicts
    private _term: Terminal;
    private _el: HTMLElement | null;
    private _socket: Socket = socket;
    private _connectionId: number;

    // will also add ITerminalOptions
    constructor(opts: {
        connectionId: number,
        el: HTMLElement | null
    }) {
        this._term = new Terminal();
        this._connectionId = opts.connectionId;
        this._el = opts.el;
    }

    // also need to add startup logic
    createNewSession(): Promise<boolean> {
        return new Promise((resolve, reject) => {

            this._socket.on("connect", () => {
                // send connection id
                this._socket.emit("connection-info", this._connectionId);
            });

            // Might switch to an event driven approach, but this works
            // e.g. term.on('success') or term.on('failure)
            this._socket.once("success", () => {
                resolve(true);
            });

            this._socket.once("error", (msg) => {
                reject(false);
            });
            try {
                this._socket.connect();
            } catch (error) {
                console.error("Failed to connect to websocket")
            }
            // register bare minimum events for setting up connection

        });
    }
    // also create enums for events
    open() {
        const fitAddon = new FitAddon();
        this._term.loadAddon(fitAddon);
        if (this._el) {
            this._term.open(this._el);
        }
        else {
            this.close(); // this might fail because term was never opened
            throw new Error(`Failed to open terminal on ${this._el}`)
        }

        this._term.onData(data => {
            console.log(`terminal.input ${data}`)
            this._socket.emit("terminal:input", data);
        });

        this._socket.on("pty:output", data => {
            // just write raw for now
            console.log(`terminal.output ${data}`);
            this._term.write(data);
        });

        this._socket.on("sessionTerminated", () => {
            console.log("terminal.terminated");
            this._socket.removeAllListeners();
            this._socket.disconnect();
        });

        this._socket.on("err", () => {
            console.log("An error occurred at the socket level");
        });
    }

    close() {
        this._socket.removeAllListeners();
        this._socket.disconnect();
        this._term.dispose();
    }
}