// This is where Terminals will be mounted, will be a window with tab functionality, split screen functionality, etc in the future
// For now just dealing with one terminal
import Header from '../components/Header';
import Terminal from '../components/Terminal'
import { useSessionsContext } from '../context/SessionsContext';
import { useReducer } from 'react';
import '../styles/TerminalView/Browser.css';


const tabReducer = (tabs, action) => {
    switch (action.type) {
        case 'add': {
            return [...tabs, action.payload];
        }
        case 'remove': {
            return tabs.filter((tab) => {
                return tab.tab_id !== action.payload.id;
            });
        }
        default:
            console.error(`Failed to process ${action.type}`);
            return tabs;
    }
}

export default function TerminalView() {
    // need to identify and render active session/s

    const addTab = () => {
        console.log(`Adding tab!`);
    }
    const { sessions } = useSessionsContext();
    console.log(sessions);
    let tabId = 0;
    const [tabs, dispatch] = useReducer(tabReducer, [{
        "tab_id": 0,
        "connection": sessions[0]
        // what info do i need to store
    }]);
    // const sessionsList = sessions;
    // const session = getActiveSession();
    if (sessions.length > 0) {
        // const { connection_id } = session;
        return (
            <div className="terminal-view">
                <Header />
                <div className="view">
                    <div className="tab-bar">
                        {tabs.map((tab) => {
                            console.log(tab);
                            return <span key={tab.tab_id} className="tab-item">
                                <span className="tab-title">{tab.connection.label}</span>
                                <span className="tab-exit-btn" onClick={() => {
                                    dispatch({
                                        type: "remove",
                                        payload: {
                                            id: tab.tab_id
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