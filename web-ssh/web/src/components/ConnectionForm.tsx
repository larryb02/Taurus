import styles from '../styles/ConnectionForm.module.css'

export default function ConnectionForm({ startSession, updateSshConnectionField }) {
    return <div className={styles.connection_form}>
        <div className={styles.connection_form_item}>
            <label>Username</label>
            <input type="text" onChange={(e) => {
                updateSshConnectionField("user", e.target.value);
                // setSshConnectionData({ ...sshConnectionData, "user": e.target.value });
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <label>Hostname</label>
            <input type="text" onChange={(e) => {
                updateSshConnectionField("hostname", e.target.value);
                // setSshConnectionData({ ...sshConnectionData, "hostname": e.target.value }); 
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <label>Password</label>
            <input type="password" onChange={(e) => {
                updateSshConnectionField("pass", e.target.value);
                // setSshConnectionData({ ...sshConnectionData, "pass": e.target.value });
            }}></input>
        </div>
        <div className={styles.connection_form_item}>
            <button onClick={startSession}>Submit</button>
        </div>
    </div>;
}