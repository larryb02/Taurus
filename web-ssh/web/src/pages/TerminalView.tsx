// This is where Terminals will be mounted, will be a window with tab functionality, split screen functionality, etc in the future
// For now just dealing with one terminal
import Header from '../components/Header';
import Terminal from '../components/Terminal'
import { useSessionsContext } from '../context/SessionsContext';
import { useReducer, useState, useRef, act } from 'react';
import '../styles/TerminalView/Browser.css';


const tabReducer = (tabs, action) => {
    switch (action.type) {
        case 'add': {
            return [...tabs, action.payload];
        }
        case 'remove': {
            return tabs.filter((tab) => {
                return tab.tabId !== action.payload.id;
            });
        }
        default:
            console.error(`Failed to process ${action.type}`);
            return tabs;
    }
}

export default function TerminalView() {
    // need to identify and render active session/s

    const { sessions } = useSessionsContext();
    console.log(sessions);
    const [tabs, dispatch] = useReducer(tabReducer, [{
        "tabId": 0,
        "connection": sessions[0]
        // what info do i need to store
    }]);

    // once i move tab to component, may make sense to make a useeffect hook to set initial active tab
    // also need to make a type for tabs
    const [activeTab, setActiveTab] = useState(0); // storing tabId

    if (sessions.length > 0) {
        // const { connection_id } = session;
        return (
            <div className="terminal-view">
                <Header />
                <div className="view">
                    <div className="tab-bar">
                        {tabs.map((tab) => {
                            console.log(tabs);
                            return <span key={tab.tabId}
                                onClick={() => { setActiveTab(tab.tabId); console.log(`Set tab id to ${tab.tabId}`) }}
                                className={`tab-item ${tab.tabId === activeTab ? 'active': ''}`}>
                                <span className="tab-title">{tab.connection.label}</span>
                                <span className="tab-exit-btn" onClick={() => {
                                    dispatch({
                                        type: "remove",
                                        payload: {
                                            id: tab.tabId
                                        }
                                    })
                                }}>x</span>
                            </span>
                        })}
                        {/* <span className="tab-item">{sessions[0].label}</span> */}
                        <span onClick={() => {
                            dispatch({
                                type: "add",
                                payload: {
                                    tabId: tabs.length,
                                    connection:
                                    {
                                        label: "test-label",
                                        hostname: "test-srv",
                                        user: "test-user",
                                        connection_id: 16
                                    }
                                }
                            });
                            console.log(tabs);
                        }} className="new-tab-btn">+</span>
                    </div>
                    <Terminal sshConnectionData={
                        // "label": label,
                        // "user": user,
                        // "hostname": hostname,
                        // "pass": "password"
                        // connection_id,
                        4
                    } />
                </div>
            </div>
        );
    }

}