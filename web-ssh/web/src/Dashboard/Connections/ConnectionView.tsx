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
    const { connections, setConnections } = useConnectionsContext();
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

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

    return (
        <Box className="connections-view">
            <Box className="connections-header">
                <Typography variant="h5">Connections</Typography>
                <Button variant="outlined"
                    onClick={handleClick}
                    sx={{
                        bgcolor: 'transparent',
                        color: 'white',
                        fontWeight: 600,
                        borderColor: 'rgba(255,255,255,0.2)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                    }}>New Connection</Button>
                    <ConnectionForm open={open} handleClose={handleClose}></ConnectionForm>
            </Box>
            <Box sx={{flexGrow: 1}} className="connections">
                {connections.length > 0 ?
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ px: 1, py: 1, justifyContent: 'flex-start' }}>
                        {connections.map((item, index) =>
                            <Grid key={item.connection_id} size={3}>
                                <ConnectionItem key={index} connection={item} />
                            </Grid>
                        )} </Grid>
                    : <div>Create a connection!</div>} {/** <-- convert this to a typography, maybe create a nice clean container for it as well  */}
            </Box>
        </Box>
    );
}