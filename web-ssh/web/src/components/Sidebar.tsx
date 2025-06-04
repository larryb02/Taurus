import { useState } from "react";
import styles from '../styles/sidebar.module.css'

export default function Sidebar() {
    const [recentConnections, setRecentConnections] = useState(['conn1', 'conn2']);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (<div className={isCollapsed ? styles.sidebar_collapsed : styles.sidebar}>
        <div><button onClick={() => {
            setIsCollapsed(!isCollapsed);
            // console.log(isCollapsed)
        }}>Collapsable button</button></div>
        {recentConnections.map((item) => 
            <div>{item}</div>
        )}
    </div>);
}