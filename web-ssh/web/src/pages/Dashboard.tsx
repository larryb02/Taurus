import { useState } from "react";
import { socket } from '../socket';
import Terminal from '../components/Terminal';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import ConnectionForm from "../components/ConnectionForm";
import page from '../page.module.css'


export default function Dashboard() {
    // first need to enter a destination
    // then need to establish a connection
    const [isLoading, setIsLoading] = useState(false);
    const [sshConnectionData, setSshConnectionData] = useState<Record<string, string>>({
        "user": "",
        "pass": "",
        "hostname": ""
    });
    const [sessionStarted, setSessionStarted] = useState(false);

    function updateSshConnectionField(field: string, value: string) {
        setSshConnectionData({ ...sshConnectionData, [field]: value });
        console.log(sshConnectionData);
    }

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
            </div> 
        );
    }

    return (
        <div className={page.top_level}>
            <Header />
            <div className={page.page}>
                <Sidebar />
                <ConnectionForm startSession={startSession} updateSshConnectionField={updateSshConnectionField} />
            </div>
        </div>
    );
}
