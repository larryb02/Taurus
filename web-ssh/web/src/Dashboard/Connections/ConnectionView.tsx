import { config } from "@taurus/config";
import { useEffect, useState } from "react";
import { useConnectionsContext } from "./ConnectionsContext";
import ConnectionItem from "./ConnectionItem";
import ConnectionForm from "./ConnectionForm";
import '@taurus/styles/Connections/ConnectionView.css';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

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

    return (
        <Box className="connections-view">
            <Box className="connections-header">
                <Typography variant="h5">Connections</Typography>
                <Button variant="outlined"
                    sx={{
                        bgcolor: 'transparent',
                        color: 'white',
                        fontWeight: 600,
                        borderColor: 'rgba(255,255,255,0.2)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                    }}>New Connection</Button>
                {/* <div className="button-container">
                <button className={`new-connection-button`} onClick={() => {
                    setIsAddingConnection(true);
                }}>New Connection</button>
            </div> */}
            </Box>
            <Box className="connections">
                {connections.length > 0 ?
                    <Grid container spacing={2} sx={{ px: 2, py: 2, justifyContent: 'flex-start' }}>
                        {connections.map((item, index) =>
                            <Grid key={item.connection_id} size={2}>
                                <ConnectionItem key={index} connection={item} />
                            </Grid>
                        )} </Grid>
                    : <div>Create a connection!</div>} {/** <-- convert this to a typography, maybe create a nice clean container for it as well  */}
            </Box>
        </Box>
    );
}