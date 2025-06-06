import styles from '../styles/ConnectionForm.module.css';
import { useConnectionsContext } from '../context/ConnectionContext';
import { useState } from 'react';

interface ConnectionFormProps {
    setIsAddingConnection: (value: boolean) => void;
}

export default function ConnectionForm({
    setIsAddingConnection
}: ConnectionFormProps) {
    const { addConnection } = useConnectionsContext();

    const [connectionData, setConnectionData] = useState<Record<string, string>>({
        "label": "",
        "user": "",
        "pass": "",
        "hostname": ""
    });

    function updateConnectionField(field: string, value: string) {
        setConnectionData({ ...connectionData, [field]: value });
        console.log(connectionData);
    }
    return <div className={styles.connection_form}>
        <div className={styles.connection_form_item}>
            <label>Label</label>
            <input type="text" onChange={(e) => {
                updateConnectionField("label", e.target.value);
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <label>Username</label>
            <input type="text" onChange={(e) => {
                updateConnectionField("user", e.target.value);
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <label>Hostname</label>
            <input type="text" onChange={(e) => {
                updateConnectionField("hostname", e.target.value);
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <label>Password</label>
            <input type="password" onChange={(e) => {
                updateConnectionField("pass", e.target.value);
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <button onClick={() => {
                console.log("Connection created");
                addConnection({ label: connectionData.label, host: connectionData.hostname, user: connectionData.user });
                // should also store in db
                setIsAddingConnection(false);
            }}>Submit</button>
        </div>
    </div>;
}