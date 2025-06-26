"use client";
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import '../styles/terminal.css';

interface terminalProps {
    sshConnectionData: number;
}

export default function terminal({ sshConnectionData }: terminalProps) { // need to resolve naming conflicts...
    /** 
     * Step 1:
     *  - Do not pass credentials from the clientside
     *  - Establish a websocket connection and handle connection logic on server
     *  - Register event listeners that signal successful or failed connection
     * Step 2:
     *  - Mount components
     *      - Terminal + socket i/o events
     * Step 3:
     *  - Make it possible to render multiple terminals and switch between them
     *  
     *
     */
    const [error, setError] = useState<string | null>(null);

    let term: Terminal | null = null;
    const openTerm = () => {
        const fitAddon = new FitAddon();
        const term = new Terminal();
        term.loadAddon(fitAddon);
        term.open(document.getElementById('terminal') as HTMLElement);
        fitAddon.fit();
    }
    const init = () => {
        // register bare minimum events for setting up connection
        socket.on("connect", () => {
            // send connection id
            socket.emit("connection-info", sshConnectionData);
        });

        socket.on("success", () => {
            // console.log(`Success!`);
            // socket.removeListener("connect");
            // setup term
            const fitAddon = new FitAddon();
            term = new Terminal();
            term?.loadAddon(fitAddon);
            if (document.getElementById('terminal')) {
                term?.open(document.getElementById('terminal') as HTMLElement);
                console.log(`Proposed Dimensions: ${JSON.stringify(fitAddon.proposeDimensions())}`);
                fitAddon.fit();
            }

            term?.onData(data => {
                console.log(`sending input event: ${JSON.stringify(data)}`);
                socket.emit("terminal:input", data);
            });

            socket.on("pty:output", (chunk) => {
                console.log("Received data from pty", chunk);
                term?.write(chunk);
            });

            socket.on("sessionTerminated", () => {
                socket.disconnect();
                term?.dispose();
            })

        });
        socket.on("err", () => {
            console.log(`error`);
            setError("Failed to establish connection");
            socket.disconnect();
        })
        socket.on("disconnect", () => {
            socket.off("status");
            console.log(`Disconnected from socket`);
        });
        socket.connect();
    }
    useEffect(() => {
        // openTerm(); only for testing
        init();
        return () => {
            console.log("Cleanup called");
            socket.removeAllListeners();
            socket.disconnect();
            term?.dispose();
        };
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>
    }

    return (
        // <div className="terminal-view">
        // <div id="container">
        <div id="terminal"></div>
        // </div>
    );
}