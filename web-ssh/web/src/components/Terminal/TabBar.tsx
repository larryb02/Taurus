import { useSessionsContext } from '../../context/SessionsContext';
import { useReducer, useState, useEffect, useRef } from 'react';
import { type Connection } from '../../types';
import '../../styles/TerminalView/Browser.css';

type Tab = {
    tabId: number;
    connection: Connection;
}

type Action = {
    type: 'add'
    payload: Tab;
} | {
    type: 'remove';
    payload: {
        id: number;
    }
}

const tabReducer = (tabs: Tab[], action: Action) => {
    const ac = action.type;
    switch (ac) {
        case 'add': {
            return [...tabs, action.payload];
        }
        case 'remove': {
            return tabs.filter((tab) => {
                return tab.tabId !== action.payload.id;
            });
        }
        default:
            console.error(`Failed to process ${ac}`);
            return tabs;
    }
}
// note convert tabIdGen to a hook, maybe tabHistory too
export default function TabBar() {
    const { sessions } = useSessionsContext();
    console.log(sessions);
    const tabIdCounter = useRef<number>(0);
    const tabHistory = useRef<number[]>([]);
    const [tabs, dispatch] = useReducer(tabReducer, [{
        "tabId": tabIdCounter.current,
        "connection": sessions[0]
        // what info do i need to store
    }]);

    tabIdCounter.current++;
    // once i move tab to component, may make sense to make a useeffect hook to set initial active tab
    // also need to make a type for tabs
    const [activeTab, setActiveTab] = useState(0); // storing tabId

    const updateActiveTab = (prev: number, cur: number): void => {
        tabHistory.current.push(prev);
        console.log(`Tab History: ${JSON.stringify(tabHistory)}`);
        setActiveTab(cur);
    }

    return (<div className="tab-bar">
        {tabs.map((tab) => {
            console.log(tabs);
            return <span key={tab.tabId}
                onClick={() => {
                    updateActiveTab(activeTab, tab.tabId);
                    console.log(`Set tab id to ${tab.tabId}`);
                }}
                className={`tab-item ${tab.tabId === activeTab ? 'active' : ''}`}>
                <span className="tab-title">{tab.connection.label}</span>
                <span className="tab-exit-btn" onClick={(e) => {
                    e.stopPropagation();
                    if (tab.tabId === activeTab) {
                        const prevTab = tabHistory.current.pop();
                        console.log(`Reverting to prev tab: ${prevTab}`);
                        if (prevTab !== undefined) setActiveTab(prevTab);
                    }
                    dispatch({
                        type: "remove",
                        payload: {
                            id: tab.tabId
                        }
                    })
                }}>x</span>
            </span>
        })}
        <span onClick={() => {
            dispatch({
                type: "add",
                payload: {
                    tabId: tabIdCounter.current++,
                    connection:
                    {
                        label: "test-label",
                        hostname: "test-srv",
                        user: "test-user",
                        connection_id: 16
                    }
                }
            });
        }} className="new-tab-btn">+</span>
    </div>)
}