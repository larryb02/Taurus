import { useRef, useReducer } from "react";
import ConnectionForm from './ConnectionForm';
import styles from '../styles/header.module.css'
import buttons from '../styles/buttons.module.css'


export default function Header() {
    function handleClick() {
        console.log("I've been clicked!");
    }
    return (<div className={styles.header}>
        <span className={styles.title}>Alpha</span>
        <span className={styles.add_connections}>
            <button className={buttons.default_button} onClick={handleClick}>New Connection</button>
        </span>
    </div>);
}