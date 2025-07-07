import { type Connection } from "@taurus/types";
import { useNavigate } from "react-router-dom";
import '@taurus/styles/Connections/ConnectionItem.css';
import { useSessionsContext } from '@taurus/Ssh/SshSessionContext';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { config } from "@taurus/config";
import { useConnectionsContext } from "./ConnectionsContext";

interface ConnectionItemProps {
    connection: Connection;
}
const removeConn = async (id: number) => {
    try {
        const res = await fetch(`${config.api.url}${config.api.routes.ssh.connection}/${id}`, {
            method: 'DELETE'
        })
        if (!res.ok) {
            throw new Error(`HTTP error ${res.status} ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error(`${error}`);
    }
}
export default function ConnectionItem({ connection }: ConnectionItemProps) {
    const nav = useNavigate();
    const { dispatch, setActiveSession } = useSessionsContext();
    const { removeConnection } = useConnectionsContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSessionStart = () => {
        console.log(`Launching ${JSON.stringify(connection)}`);
        setActiveSession(connection);
        dispatch({
            type: 'update',
            payload: connection
        });
        nav("/session"); {/* bare minimum to start a terminal */ }
    }
    const mutation = useMutation({ mutationFn: removeConn });
    const handleRemove = (conn_id: number) => {
        mutation.mutate(conn_id, {
            onSuccess() {
                removeConnection(connection);
            }
        })

    }
    return (
        <>
            <Card sx={{
                // minWidth: 275,
                bgcolor: 'rgba(255, 255, 255, 0.05)', // translucent gray on dark bg
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 2,
                boxShadow: 3,
                backdropFilter: 'blur(4px)', // optional for extra smoothness
            }}>
                <CardContent sx={{
                    justifyContent: 'flex-end',
                    padding: 2,
                }}>
                    <Typography sx={{ color: 'whitesmoke' }}>{connection.label}</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 1,
                            minWidth: 50,
                            maxWidth: 150,
                            height: 30,
                            px: 0,
                            ml: 'auto'
                        }}
                    >
                        <Button
                            onClick={handleSessionStart}
                            variant="text"
                            sx={{
                                px: 0,
                                color: 'white',
                                fontWeight: 600,
                                textTransform: 'none',
                                bgcolor: 'transparent',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                                minWidth: 100
                            }}
                            size="small"
                        >
                            Connect
                        </Button>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                        <IconButton
                            sx={{
                                px: 1.5,
                                color: 'white',
                                borderRadius: 0,
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                            }}
                            size="small"
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>
            <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
            >
                {/* Removing this because it will be useless in the near future 
                <MenuItem
                    onClick={handleEdit}
                >
                    Edit
                </MenuItem> * does nothing currently */}
                <MenuItem
                    onClick={() => handleRemove(connection.connection_id)}
                >
                    Remove
                </MenuItem> {/** does nothing currently */}
            </Menu>
        </>
    );
}