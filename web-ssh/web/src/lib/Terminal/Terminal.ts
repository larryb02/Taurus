import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { socket } from './socket';
import type { Socket } from 'socket.io-client';

export default class TerminalTTY { // Rename because of type conflicts
    private _term: Terminal;
    private _el: HTMLElement | null = document.getElementById('terminal');
    private _socket: Socket = socket;

    constructor() {
        this._term = new Terminal();
    } 

    // also need to add startup logic
    open() {
        const fitAddon = new FitAddon();
        this._term.loadAddon(fitAddon);
        if (this._el)
            this._term.open(this._el);

        this._term.onData(data => {
            this._socket.emit("terminal:input", data);
        });

        this._socket.on("pty:output", data => {
            // just write raw for now
            this._term.write(data);
        });

        this._socket.on("sessionTerminated", () => {
            this._socket.removeAllListeners();
            this._socket.disconnect();
        })

        this._socket.on("err", () => {
            console.log("An error occurred at the socket level");
        })
    }

    close() {
        this._term.dispose();
    }
}