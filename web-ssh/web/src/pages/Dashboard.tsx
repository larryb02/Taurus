import { useState } from "react";
import { socket } from '../socket';
import Terminal from '../components/Terminal';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import page from '../page.module.css'


export default function Dashboard() {
    // Get all connections from db and render
    // when user clicks a connection, trigger a new ssh session
        // eventually this will also have options to delete etc
    const [isLoading, setIsLoading] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);

    function startSession() {
        
        setIsLoading(true);
        console.log(`Connecting with session credentials:\n`);
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
                    {/* <Terminal sshConnectionData={sshConnectionData} sessionStarted={sessionStarted} /> */}
                </div>
            </div> 
        );
    }

    return (
        <div className={page.top_level}>
            <Header />
            <div className={page.page}>
                {/* <Sidebar /> */}
                Connections go here
            </div>
        </div>
    );
}
