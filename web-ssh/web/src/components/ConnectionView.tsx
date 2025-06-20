import { config } from "../config";
import { useEffect, useState } from "react";
import { useConnectionsContext } from "../context/ConnectionsContext";
import ConnectionItem from "./ConnectionItem";
import ConnectionForm from "../components/ConnectionForm";
import '../styles/ConnectionView.css';
import buttons from '../styles/buttons.module.css';

export default function ConnectionView() {
    const [isAddingConnection, setIsAddingConnection] = useState<boolean>(false); // add connection button
    const { connections, setConnections } = useConnectionsContext();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // NOTE: fetching connections after getting user works for now, 
                // but consider moving this to a function in ConnectionsContext
                const res = await fetch(`${config.api.url}${config.api.routes.ssh.connection}`, {
                    credentials: "include"
                });
                const data = await res.json();
                setConnections(data["results"]);
            } catch (error) {
                throw new Error(`Failed to fetch ${error}`);
            }
        }
        fetchUser();
    }, []);

    if (isAddingConnection) {
        // we'll do some css magic here -> like a modal
        // but for now we'll do this
        return (
            <div className="connections-view">
                <ConnectionForm setIsAddingConnection={setIsAddingConnection} />
            </div>
        )
    }

    return <div className="connections-view">
        <div className="connections-header">
            <div className="button-container">
                <button className={`${buttons.default_button} new-connection-button`} onClick={() => {
                    setIsAddingConnection(true);
                }}>New Connection</button>
            </div>
        </div>
        <div className="connection-list">
            {connections.length > 0 ? connections.map((item) =>
                <ConnectionItem connection={item} />
            ) : <div>Create a connection!!</div>}
        </div>
    </div>;
}