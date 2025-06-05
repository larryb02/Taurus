import styles from '../styles/header.module.css'
import buttons from '../styles/buttons.module.css'
import { useNavigate } from "react-router";


export default function Header() {
    let nav = useNavigate();

    // change button to a link
    return (<div className={styles.header}>
        <span className={styles.title}>Alpha</span>
        <span className={styles.add_connections}>
            <button className={buttons.default_button} onClick={() => {
                nav("/add-connection");
            }}>New Connection</button>
        </span>
    </div>);
}