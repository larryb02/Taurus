"use client";
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { useEffect } from 'react';
// import { io, Socket } from 'socket.io-client';
import { socket } from '../socket';
import termView from '../styles/terminal.module.css'

interface terminalProps {
    sshConnectionData: Record<string, string>;
    sessionStarted: boolean;

}

export default function terminal({ sshConnectionData, sessionStarted }: terminalProps) { // need to resolve naming conflicts...
  useEffect(() => {
        // note add a case if connection to socket fails
        let term: Terminal | null = null;
        if (sessionStarted) {
            term = new Terminal();
            console.log(`New terminal instance created`);
            if (document.getElementById('terminal')) {
                term.open(document.getElementById('terminal') as HTMLElement);
            }
            socket.on("connect", () => {
                /*
                    - Attempt to connect to host 
                    - If connection error set status and show error
                    - If password required write password to pty ()
                        - If incorrect provide a prompt to reattempt
                        - Need to handle 'too many failed attempts' case
                    - If made it here connection should be established set status to 'connected'
                */
                // console.log(destination.destination);
                socket.emit("sessionData", sshConnectionData); // initial connection send user, host, and password
                // setIsLoading(true);
                // setTimeout(() => {
                //      setIsLoading(false);
                // }, 5000);
                console.log("Connected: ", socket.id);
            });

            term.onData(data => {
                console.log(`sending input event: ${JSON.stringify(data)}`);
                socket.emit("terminal:input", data);
            });

            socket.on("pty:output", (chunk) => {
                console.log("Received data from pty", chunk);
                term?.write(chunk);
            });

            socket.on("sessionTerminated", () => {
                socket.disconnect();
            })

            // socket.on("disconnect", (reason) => {
            //     console.log(`Disconnected from socket ${socket.id}\nReason: ${reason}`);
            //     setSessionStarted(false);
            // });

            socket.on("error", (err: any) => {
                console.error(err);
            });

            socket.connect();

        }

        return () => {
            console.log("Cleanup called");
            socket.off('connect');
            socket.off('pty:output');
            socket.off('pty:disconnect');
            socket.disconnect();
            term?.dispose();
        };
    }, [sessionStarted]);



  return (
    <div className={termView.terminal_view}>
      <div id="terminal"></div>
    </div>
  );
}