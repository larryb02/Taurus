import styles from '../styles/header.module.css'
import buttons from '../styles/buttons.module.css'

export default function Header() {
    return (<div className={styles.header}>
        <span className={styles.title}>Alpha</span>
        <span className={styles.add_connections}>
            <button className={buttons.default_button}>New Connection</button>
        </span>
    </div>);
}