import { useEffect, useState } from "react";
import buttons from '../styles/buttons.module.css'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import page from '../page.module.css'
import '../styles/Dashboard.css'
import ConnectionForm from "../components/ConnectionForm";
import ConnectionItem from "../components/ConnectionItem";
import { useConnectionsContext } from "../context/ConnectionsContext";
import { useUserContext } from "../context/UserContext";
import { config } from "../config";
import { type User } from "../types";


export default function Dashboard() {
    // Get all connections from db and render
    // when user clicks a connection, trigger a new ssh session
    // eventually this will also have options to delete etc

    const [isAddingConnection, setIsAddingConnection] = useState<boolean>(false); // add connection button
    const { connections, setConnections } = useConnectionsContext();
    const { setCurrentUser } = useUserContext();


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${config.api.url}${config.api.routes.auth.user}`, {
                    credentials: "include"
                });
                const json = await res.json();
                if (!res.ok) {
                    throw new Error(`No user signed in.`);
                }
                const user: User = {
                    userId: json['result']['user_id'],
                    email: json['result']['email_address'],
                    username: json['result']['username']
                };
                setCurrentUser(user);

                // NOTE: fetching connections after getting user works for now, 
                // but consider moving this to a function in ConnectionsContext
                const res2 = await fetch(`${config.api.url}${config.api.routes.ssh.connection}`, {
                    credentials: "include"
                });
                const json2 = await res2.json();
                setConnections(json2["results"]);
            } catch (error) {
                throw new Error(`Failed to fetch ${error}`);
            }
        }
        fetchUser();
    }, []);


    // useEffect(() => {
    //     console.log(`Starting Fetch: ${config.api.url}${config.api.routes.ssh.connection}`);
    //     (async () => {
    //         try {
    //             const res = await fetch(`${config.api.url}${config.api.routes.ssh.connection}`);
    //             // console.log(res);
    //             const json = await res.json();
    //             if (!res.ok) {
    //                 throw new Error(`Failed to fetch ssh connections: ${res.status}, ${res.statusText}`);
    //             }
    //             setConnections(json["results"]);
    //         } catch (error) {
    //             throw new Error(`Failed to fetch connections ${error}`);
    //         }
    //     })();
    //     console.log(`Fetch for ${config.api.url}${config.api.routes.ssh.connection} complete`)
    //     return () => {
    //     }
    // }, []);



    if (isAddingConnection) {
        // we'll do some css magic here -> like a nice animation to render a panel
        // but for now we'll do this
        return (
            <div className={page.top_level}>
                <Header />
                {/* <ConnectionsProvider> */}
                <ConnectionForm setIsAddingConnection={setIsAddingConnection} />
                {/* </ConnectionsProvider> */}
            </div>
        )
    }

    return (
        // <ConnectionsProvider>
        <div className="dashboard">
            <Header />
            <button className={buttons.default_button} onClick={() => {
                setIsAddingConnection(true);
            }}>New Connection</button>
            <div className={page.page}>
                <Sidebar />
                {connections.length > 0 ? connections.map((item) =>
                    <ConnectionItem connection={item} />
                ) : <div>Create a connection!!</div>}
            </div>
        </div>
        // </ConnectionsProvider>
    );
}
