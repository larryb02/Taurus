// import styles from '@taurus/styles/ConnectionForm.module.css';
import { useConnectionsContext } from '@taurus/Dashboard/Connections/ConnectionsContext';
import { useState } from 'react';
import { config } from '@taurus/config'
import { updateField } from '@taurus/utils';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';


export default function ConnectionForm({ open, handleClose}) {
    // TODO: DON'T ALLOW EMPTY FORMS
    const { addConnection } = useConnectionsContext();

    const [connectionData, setConnectionData] = useState<Record<string, string>>({
        "label": "",
        "user": "",
        "password": "",
        "hostname": ""
    });

    const [error, setError] = useState<string | null>(null);

    // const updateConnectionField = (field: string, value: string) => {
    //     setConnectionData({ ...connectionData, [field]: value });
    //     console.log(connectionData);
    // }

    const createNewConnection = async () => {
        if (connectionData.label === "") {
            setError("Label cannot be empty");
            return;
        }
        if (connectionData.user === "") {
            setError("User cannot be empty.");
            return;
        }
        if (connectionData.hostname === "") {
            setError("Hostname cannot be empty.");
            return;
        }
        if (connectionData.password === "") {
            setError("Password cannot be empty.");
            return;
        }
        try {
            let res = await fetch(`${config.api.url}${config.api.routes.ssh.connection}`, {
                method: "POST",
                body: JSON.stringify({
                    label: connectionData.label,
                    hostname: connectionData.hostname,
                    username: connectionData.user,
                    credentials: {
                        auth_type: "password", // hardcoding is temporary
                        credentials: connectionData.password
                    }
                }),
                headers: {
                    "content-type": "application/json"
                },
                credentials: "include"
            });

            if (!res.ok) {
                setError("Something went wrong, please try again.");
                throw new Error(`Failed to process request: ${res.status}, ${res.statusText}`)
            }

            res = await res.json();
            const {connection_id, label, hostname} = res['results'];
            console.log(`Id: ${connection_id}, Label: ${label}, Hostname: ${hostname}`);
            addConnection({
                connection_id: connection_id,
                label: label,
                hostname: hostname,
                user: connectionData.user, // Response currently isn't returning user, i should change this 
            });
            handleClose();
            // setIsAddingConnection(false);
        } catch (error) {
            setError("Something went wrong, please try again.");
            throw new Error(`Failed to add connection to db ${error}`);
        }
    }
    return (
       <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth={true} PaperProps={{
                           sx: {
                               bgcolor: '#1e1e1e',
                               color: 'white',
                           },
                       }}>
            <DialogTitle>
                <Typography>Add Connection</Typography>
            </DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={2}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {/* <form> */}
                    {/* <FormControl> */}
                    <InputLabel sx={{ color: 'white' }}>Label</InputLabel>
                    <TextField
                        autoFocus
                        required
                        name="label"
                        label="Label"
                        sx={{
                            input: { bgcolor: '#121212', color: 'white' },
                            '& label': { color: 'white' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#333',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#555',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1e88e5',
                                },
                            },
                        }}
                        onChange={(e) => { 
                            if (error) {
                                setError(null);
                            }
                            updateField(connectionData, setConnectionData, "label", e.target.value);
                        }} 
                            />
                    <InputLabel sx={{ color: 'white' }}>Hostname</InputLabel>
                    <TextField
                        autoFocus
                        required
                        name="Hostname"
                        label="Hostname"
                        sx={{
                            input: { bgcolor: '#121212', color: 'white' },
                            '& label': { color: 'white' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#333',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#555',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1e88e5',
                                },
                            },
                        }}
                        onChange={(e) => { 
                            if (error) {
                                setError(null);
                            }
                            updateField(connectionData, setConnectionData, "hostname", e.target.value)
                        }} 
                            />
                    <InputLabel sx={{ color: 'white' }}>User</InputLabel>
                    <TextField
                        autoFocus
                        required
                        sx={{
                            input: { bgcolor: '#121212', color: 'white' },
                            '& label': { color: 'white' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#333',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#555',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1e88e5',
                                },
                            },
                        }}
                        label="User" 
                        onChange={(e) => { 
                            if (error) {
                                setError(null);
                            }
                            updateField(connectionData, setConnectionData, "user", e.target.value);
                        }} 
                        />
                    <InputLabel sx={{ color: 'white' }}>Password</InputLabel>
                    <TextField
                        autoFocus
                        required
                        type='password'
                        label="Password"
                        sx={{
                            input: { bgcolor: '#121212', color: 'white' },
                            '& label': { color: 'white' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#333',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#555',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1e88e5',
                                },
                            },
                        }} 
                        onChange={(e) => { 
                            if (error) {
                                setError(null);
                            }
                            updateField(connectionData, setConnectionData, "password", e.target.value);
                        }} />
                    <InputLabel sx={{ color: 'white' }}>Port</InputLabel>
                    <TextField
                        autoFocus
                        label="Port"
                        sx={{
                            input: { bgcolor: '#121212', color: 'white' },
                            '& label': { color: 'white' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#333',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#555',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1e88e5',
                                },
                            },
                        }} 
                        />
                    <Button variant="contained" sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        bgcolor: '#2e2e2e',
                        color: 'white',
                        '&:hover': {
                            bgcolor: '#3a3a3a',
                        },
                        maxWidth: 100
                    }}
                        size="small"
                        onClick={() => {createNewConnection()}}
                    >Create</Button>
                </Stack>
            </DialogContent>
        </Dialog>);
    // <div className={styles.connection_form}>
    //     <div className="exit-button">
    //         <button onClick={() => setIsAddingConnection(false)}>Exit</button>
    //     </div>
    //     <div className={styles.connection_form_item}>
    //         <label>Label</label>
    //         <input type="text" onChange={(e) => {
    //             updateField(connectionData, setConnectionData, "label", e.target.value);
    //         }}></input>
    //     </div>
    //     <div className={styles.connection_form_item}>
    //         <label>Username</label>
    //         <input type="text" onChange={(e) => {
    //             updateField(connectionData, setConnectionData, "user", e.target.value);
    //         }}></input>
    //     </div>
    //     <div className={styles.connection_form_item}>
    //         <label>Hostname</label>
    //         <input type="text" onChange={(e) => {
    //             updateField(connectionData, setConnectionData, "hostname", e.target.value);
    //         }}></input>
    //     </div>
    //     <div className={styles.connection_form_item}>
    //         <label>Password</label>
    //         <input type="password" onChange={(e) => {
    //             updateField(connectionData, setConnectionData, "password", e.target.value);
    //         }}></input>
    //     </div>
    //     {error !== null &&
    //         <div className="error-msg">
    //             {error}
    //         </div>
    //     }
    //     <div className={styles.connection_form_item}>
    //         <button onClick={() => {
    //             // addConnection({ label: connectionData.label, host: connectionData.hostname, user: connectionData.user });
    //             // should also store in db
    //             createNewConnection();
    //         }}>Submit</button>
    //     </div>
    // </div>;
}