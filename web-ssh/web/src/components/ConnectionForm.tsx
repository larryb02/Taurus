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

    // const updateConnectionField = (field: string, value: string) => {
    //     setConnectionData({ ...connectionData, [field]: value });
    //     console.log(connectionData);
    // }

    const createNewConnection = async (conn: Record<string, string>) => {
        console.log(`Adding new connection to db ${JSON.stringify(conn)}`);
        try {
            let res = await fetch(`${config.api.url}${config.api.routes.ssh.connection}`, {
                method: "POST",
                body: JSON.stringify(conn),
                headers: {
                    "content-type": "application/json"
                }
            });

            if (!res.ok) {
                throw new Error(`Something went wrong ${res.status}, ${res.statusText}`)
            }

            res = await res.json();

            addConnection({
                label: connectionData.label,
                hostname: connectionData.hostname,
                user: connectionData.user
            }
            );
            console.log(res);
        } catch (error) {
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
        <div className={styles.connection_form_item}>
            <button onClick={() => {
                console.log("Connection created");
                // addConnection({ label: connectionData.label, host: connectionData.hostname, user: connectionData.user });
                // should also store in db
                createNewConnection(connectionData);
                setIsAddingConnection(false);
            }}>Submit</button>
        </div>
    </div>;
}