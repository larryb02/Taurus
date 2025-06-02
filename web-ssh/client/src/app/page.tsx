"use client";

import '@xterm/xterm/css/xterm.css';
import { useState, useEffect } from "react";
import { socket } from '../socket';
import Terminal from '../components/Terminal';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import termView from '../styles/terminal.module.css'
import page from './page.module.css'


export default function session() {
    // first need to enter a destination
    // then need to establish a connection
    const [isLoading, setIsLoading] = useState(false);
    const [sshConnectionData, setSshConnectionData] = useState<Record<string, string>>({
        "user": "",
        "pass": "",
        "hostname": ""
    });
    const [sessionStarted, setSessionStarted] = useState(false);

    // useEffect(() => {
    //     // note add a case if connection to socket fails
    //     let term = null;
    //     if (sessionStarted) {
    //         term = new Terminal();
    //         console.log(`New terminal instance created`);
    //         if (document.getElementById('terminal')) {
    //             term.open(document.getElementById('terminal') as HTMLElement);
    //         }
    //         socket.on("connect", () => {
    //             /*
    //                 - Attempt to connect to host 
    //                 - If connection error set status and show error
    //                 - If password required write password to pty ()
    //                     - If incorrect provide a prompt to reattempt
    //                     - Need to handle 'too many failed attempts' case
    //                 - If made it here connection should be established set status to 'connected'
    //             */
    //             // console.log(destination.destination);
    //             socket.emit("sessionData", sshConnectionData); // initial connection send user, host, and password
    //             // setIsLoading(true);
    //             setTimeout(() => {
    //                 setIsLoading(false);
    //             }, 5000);
    //             console.log("Connected: ", socket.id);
    //         });

    //         term.onData(data => {
    //             console.log(`sending input event: ${JSON.stringify(data)}`);
    //             socket.emit("terminal:input", data);
    //         });

    //         socket.on("pty:output", (chunk) => {
    //             console.log("Received data from pty", chunk);
    //             term.write(chunk);
    //         });

    //         socket.on("sessionTerminated", () => {
    //             socket.disconnect();
    //         })

    //         socket.on("disconnect", (reason) => {
    //             console.log(`Disconnected from socket ${socket.id}\nReason: ${reason}`);
    //             setSessionStarted(false);
    //         });

    //         socket.on("error", (err) => {

    //         });

    //         socket.connect();

    //     }

    //     return () => {
    //         console.log("Cleanup called");
    //         socket.off('connect');
    //         socket.off('pty:output');
    //         socket.off('pty:disconnect');
    //         socket.disconnect();
    //         term?.dispose();
    //     };
    // }, [sessionStarted]);

    function startSession() {
        for (const key in sshConnectionData) {
            if (sshConnectionData[key] === "") {
                console.warn(`${key} cannot be empty.`);
                return;
            }
        }
        setIsLoading(true);
        console.log(`Connecting with session credentials:\n`);
        for (const key in sshConnectionData) {
            console.log(`${key}:${sshConnectionData[key]}`);
        }
        setSessionStarted(true);
        setIsLoading(false); // will be moved once sign-in is ironed out
        socket.on("disconnect", (reason) => {
            console.log(`Disconnected from socket ${socket.id}\nReason: ${reason}`);
            setSessionStarted(false);
        }); // another hack, gonna rewrite tf out of this code just need terminal in a component for now
    }

    if (isLoading) {
        return (<div>Loading!!!</div>);
    }


    if (sessionStarted) {
        return (
            <div className={page.top_level}>
                <Header />
                <div className={page.page}>
                    <Sidebar />
                    <Terminal sshConnectionData={sshConnectionData} sessionStarted={sessionStarted} />
                </div>
            </div> // passing sessionstarted is just a hack for now
            // <div>
            //     <div id="terminal"></div>
            // </div>
        );
    }

    return (
        <div className={page.top_level}>
            <Header />
            <div className={page.page}>
                <Sidebar />
                <div className={termView.terminal_view}>
                    <label>Username</label>
                    <input type="text" onChange={(e) => {
                        setSshConnectionData({ ...sshConnectionData, "user": e.target.value });
                    }}></input>
                    <label>Hostname</label>
                    <input type="text" onChange={(e) => { setSshConnectionData({ ...sshConnectionData, "hostname": e.target.value }); }}></input>
                    <label>Password</label>
                    <input type="password" onChange={(e) => {
                        setSshConnectionData({ ...sshConnectionData, "pass": e.target.value });
                    }}></input>
                    <button onClick={() => {
                        startSession();
                    }}>Submit</button>
                </div>
            </div>
        </div>
    )
}