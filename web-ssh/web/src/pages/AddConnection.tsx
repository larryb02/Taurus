import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ConnectionForm from "../components/ConnectionForm";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HOSTNAME = "http://localhost:8000"

export default function AddConnection() {
    // first need to enter a destination
    // then need to establish a connection
    // const [isLoading, setIsLoading] = useState(false);
    const [sshConnectionData, setSshConnectionData] = useState<Record<string, string>>({
        "user": "",
        "pass": "",
        "hostname": ""
    });
    let navigate = useNavigate();
    // const [sessionStarted, setSessionStarted] = useState(false);

    function updateSshConnectionField(field: string, value: string) {
        setSshConnectionData({ ...sshConnectionData, [field]: value });
        console.log(sshConnectionData);
    }

    async function createConnection() {
        for (const key in sshConnectionData) {
            if (sshConnectionData[key] === "") {
                console.error(`${key} cannot be empty`);
                // display an error message
                return;
            }
        }

        console.debug(`Creating new connection with data ${sshConnectionData}`);
        fetch(`${HOSTNAME}/api/ssh/connection`, {
            method: "POST",
            // body: JSON.stringify(sshConnectionData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`${res.status}, ${res.statusText}`);
            }
            else {
                return res.json();
            }
        })
        .then((json) => console.log(json))
        .then(() => {
            console.log("Redirecting to /dashboard");
            navigate("/dashboard");
        })
        .catch((error) => {
            console.error(`Failed to create new Connection. Reason: ${error}`);
            return;
        });
    }
    // function startSession() {
    //     for (const key in sshConnectionData) {
    //         if (sshConnectionData[key] === "") {
    //             console.warn(`${key} cannot be empty.`);
    //             return;
    //         }
    //     }
    //     // setIsLoading(true);
    //     console.log(`Connecting with session credentials:\n`);
    //     for (const key in sshConnectionData) {
    //         console.log(`${key}:${sshConnectionData[key]}`);
    //     }
    //     setSessionStarted(true);
    //     // setIsLoading(false); // will be moved once sign-in is ironed out
    //     // socket.on("disconnect", (reason) => {
    //     //     console.log(`Disconnected from socket ${socket.id}\nReason: ${reason}`);
    //     //     setSessionStarted(false);
    //     // }); // another hack, gonna rewrite tf out of this code just need terminal in a component for now
    // }
    return (
        <div>
            <Header />
            {/* <Sidebar /> */}
            <ConnectionForm updateSshConnectionField={updateSshConnectionField} createConnection={createConnection} />
        </div>
    );
}