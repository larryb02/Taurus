import { type Connection } from "@taurus/types";
import { useNavigate } from "react-router-dom";
import '@taurus/styles/Connections/ConnectionItem.css';
import { useSessionsContext } from '@taurus/context/SessionsContext';
import Dropdown from "@taurus/Common/Dropdown";
import { Button, IconButton, Card, CardContent, Typography, Box, Divider } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ConnectionItemProps {
    connection: Connection;
}

export default function ConnectionItem({ connection }: ConnectionItemProps) {
    const nav = useNavigate();
    const { dispatch } = useSessionsContext();
    return (
        <Card sx={{
            minWidth: 275,
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
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
        // <div className="connection_item">
        //     <div className="connection_details">{connection.label}</div>
        //     <div className="connect-button">
        //         <button onClick={() => {
        //             console.log(`Launching ${JSON.stringify(connection)}`);
        //             dispatch({
        //                 type: 'update',
        //                 payload: connection
        //             });
        //             nav("/session"); {/* bare minimum to start a terminal */ }
        //         }}>Connect
        //         </button>
        //         <Dropdown triggerLabel=":" items={[{
        //             "content": "Edit"
        //         }, {
        //             "content": "Remove"
        //         }]} />
        //     </div>
        // </div>
    );
}