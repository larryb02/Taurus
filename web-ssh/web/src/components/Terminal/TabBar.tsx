import { useSessionsContext } from '../../context/SessionsContext';
import { useReducer, useState, useEffect, act } from 'react';
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

const tabHistory: number[] = []; // just store the tabIds in here, don't necessarily want this to be global scope

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

export default function TabBar() {
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

    const updateActiveTab = (prev: number, cur: number): void => {
        tabHistory.push(prev);
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
                        const prevTab = tabHistory.pop();
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
        }} className="new-tab-btn">+</span>
    </div>)
}