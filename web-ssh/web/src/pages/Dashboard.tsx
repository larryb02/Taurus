import { useEffect, useState } from "react";
import buttons from '../styles/buttons.module.css'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import page from '../page.module.css'
import ConnectionForm from "../components/ConnectionForm";
import ConnectionItem from "../components/ConnectionItem";
import { useConnectionsContext } from "../context/ConnectionsContext";


export default function Dashboard() {
    // Get all connections from db and render
    // when user clicks a connection, trigger a new ssh session
    // eventually this will also have options to delete etc

    const [isAddingConnection, setIsAddingConnection] = useState<boolean>(false); // add connection button
    const { connections, setConnections } = useConnectionsContext();

    useEffect(() => {
        const API_HOST = "http://localhost:8000/api";
        
        (async () => {
            try {
                const res = await fetch(`${API_HOST}/ssh/connection`);
                // console.log(res);
                const json = await res.json();
                if (!res.ok) {
                    throw new Error(`Failed to fetch ssh connections: ${res.status}, ${res.statusText}`);
                }
                setConnections(json["results"]);
            } catch (error) {
                throw new Error(`Failed to fetch connections ${error}`);
            }
        })();

        return () => {

        }
    }, []);
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
        <div className={page.top_level}>
            <Header />
            <button className={buttons.default_button} onClick={() => {
                setIsAddingConnection(true);
            }}>New Connection</button>
            <div className={page.page}>
                <Sidebar />
                {connections.map((item) =>
                    <ConnectionItem connection={item} />
                )}
            </div>
        </div>
        // </ConnectionsProvider>
    );
}
