import { useState } from "react";
import styles from '@taurus/styles/sidebar.module.css'
import { NavLink } from "react-router-dom";
// import { useSessionsContext } from "../context/SessionsContext";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    // const { getActiveSession } = useSessionsContext(); // will be used to render navlinks to active sessions in the future

    return (<div className={isCollapsed ? styles.sidebar_collapsed : styles.sidebar}>
        <div><button onClick={() => {
            setIsCollapsed(!isCollapsed);
            // console.log(isCollapsed)
        }}>Collapsable button</button></div>
        <NavLink to='/dashboard'>Dashboard</NavLink>
    </div>);
}