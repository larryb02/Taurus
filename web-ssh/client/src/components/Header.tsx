import styles from '../styles/header.module.css'

export default function Header() {
    return (<div className={styles.header}>
        <span className={styles.title}>Alpha</span>
        <span className={styles.add_connections}>
            <button>Click Me!</button>
        </span>
    </div>);
}