"use client";
import Terminal from "../components/Terminal";
import { useState } from "react";
export default function session() {
    // first need to enter a destination
    // then need to establish a connection
    const [isLoading, setIsLoading] = useState(false);
    const [destination, setDestination] = useState("");
    const [sessionStarted, setSessionStarted] = useState(false);

    function startSession() {
        if (destination === "") {
            console.log(`destination cannot be empty.`);
            // render an error here
            return;
        }
        setIsLoading(true);
        console.log(`starting ssh connection to ${destination}`);
        setSessionStarted(true);
        setIsLoading(false);
    }

    if (isLoading) {
        return (<div>Loading!!!</div>);
    }

    if (sessionStarted) {
        return (
            <div><Terminal destination={destination} /></div>
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
