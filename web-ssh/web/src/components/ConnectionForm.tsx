import styles from '../styles/ConnectionForm.module.css'

interface ConnectionFormProps {
  createConnection: () => void;
  updateSshConnectionField: (field: string, value: string) => void;
}

export default function ConnectionForm({ 
    createConnection, 
    updateSshConnectionField 
} : ConnectionFormProps) {
    return <div className={styles.connection_form}>
        <div className={styles.connection_form_item}>
            <label>Username</label>
            <input type="text" onChange={(e) => {
                updateSshConnectionField("user", e.target.value);
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <label>Hostname</label>
            <input type="text" onChange={(e) => {
                updateSshConnectionField("hostname", e.target.value);
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <label>Password</label>
            <input type="password" onChange={(e) => {
                updateSshConnectionField("pass", e.target.value);
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <button onClick={createConnection}>Submit</button>
        </div>
    </div>;
}