import { config } from "@taurus/config";
import { useEffect, useState } from "react";
import { useConnectionsContext } from "./ConnectionsContext";
import ConnectionItem from "./ConnectionItem";
import ConnectionForm from "./ConnectionForm";
import '@taurus/styles/Connections/ConnectionView.css';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

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
                console.log(data["results"]);
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

    return <Box className="connections-view">
        <div className="connections-header">
            <div className="title">Connections</div>
            <div className="button-container">
                <button className={`new-connection-button`} onClick={() => {
                    setIsAddingConnection(true);
                }}>New Connection</button>
            </div>
        </div>
        <Grid container spacing={2} sx={{ px: 2, py: 2 }}>
                {connections.length > 0 ? connections.map((item, index) => 
                    <ConnectionItem key={index} connection={item} />
                ) : <div>Create a connection!</div>}
        </Grid>
        {/* <div className="connection-list">
            {connections.length > 0 ? connections.map((item, index) =>
                <ConnectionItem key={index} connection={item} />
            ) : <div>Create a connection!!</div>}
        </div> */}
    </Box>;
}