import styles from '../styles/ConnectionForm.module.css';
import { useConnectionsContext } from '../context/ConnectionsContext';
import { useState } from 'react';
import { config } from '../config'
import { updateField } from '../utils';

interface ConnectionFormProps {
    setIsAddingConnection: (value: boolean) => void;
}

export default function ConnectionForm({
    setIsAddingConnection
}: ConnectionFormProps) {
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

            addConnection({
                label: connectionData.label,
                hostname: connectionData.hostname,
                user: connectionData.user
            }
            );
            console.log(res);
            setIsAddingConnection(false);
        } catch (error) {
            setError("Something went wrong, please try again.");
            throw new Error(`Failed to add connection to db ${error}`);
        }
    }
    return <div className={styles.connection_form}>
        <div className="exit-button">
            <button onClick={() => setIsAddingConnection(false)}>Exit</button>
        </div>
        <div className={styles.connection_form_item}>
            <label>Label</label>
            <input type="text" onChange={(e) => {
                updateField(connectionData, setConnectionData, "label", e.target.value);
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <label>Username</label>
            <input type="text" onChange={(e) => {
                updateField(connectionData, setConnectionData, "user", e.target.value);
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <label>Hostname</label>
            <input type="text" onChange={(e) => {
                updateField(connectionData, setConnectionData, "hostname", e.target.value);
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <label>Password</label>
            <input type="password" onChange={(e) => {
                updateField(connectionData, setConnectionData, "password", e.target.value);
            }}></input>
        </div>
        {error !== null &&
            <div className="error-msg">
                {error}
            </div>
        }
        <div className={styles.connection_form_item}>
            <button onClick={() => {
                // addConnection({ label: connectionData.label, host: connectionData.hostname, user: connectionData.user });
                // should also store in db
                createNewConnection();
            }}>Submit</button>
        </div>
    </div>;
}