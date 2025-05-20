"use client";
// import Terminal from "../components/Terminal";
import { useState, useEffect } from "react";
import { socket } from '../socket';
import { TerminalHandler } from "../terminal";
import '@xterm/xterm/css/xterm.css';


export default function Session() {
    // first need to enter a destination
    // then need to establish a connection
    const [isLoading, setIsLoading] = useState(false);
    const [destination, setDestination] = useState("");
    const [sessionStarted, setSessionStarted] = useState(false);
    const [termHandler, setTermHandler] = useState<TerminalHandler | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
      if (sessionStarted && termHandler) {
        termHandler.init();
      }

      return () => {
        termHandler?.dispose();
      }
    }, [sessionStarted, termHandler]);

    function startSession() {
        if (destination === "") {
            console.log(`destination cannot be empty.`);
            // render an error here
            return;
        }
        setIsLoading(true);
        console.log(`starting ssh connection to ${destination}`);
        const handler = new TerminalHandler(socket, destination);
        setTermHandler(handler);
        setSessionStarted(true);
        setIsLoading(false);
    }

    if (isLoading) {
        return (<div>Loading!!!</div>);
    }

    if (error) {
      return (<div>Error</div>);
    }

    if (sessionStarted) {
        return (
            // <div><Terminal destination={destination} /></div>
            <div>
              <div id="terminal"></div>
            </div>
        );
    }

    return (
        <div>
            <label>Hostname</label>
            <input type="text" onChange={(e) => { setDestination(e.target.value) }}></input>
            <button onClick={() => {
                startSession();
            }}>Submit</button>
        </div>
    )
}
