import { useState } from "react";
import styles from '../styles/sidebar.module.css'

export default function Sidebar() {
    const [recentConnections, setRecentConnections] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (<div className={isCollapsed ? styles.sidebar_collapsed : styles.sidebar}>
        <div><button onClick={() => {
            setIsCollapsed(!isCollapsed);
            console.log(isCollapsed)
        }}>Collapsable button</button></div>
        <div>Manage Connections</div>
        <div>Recent Connection 1</div>
    </div>);
}