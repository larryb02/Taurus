import { type Connection } from "@taurus/types";

type Tab = {
    tabId: number;
    connection: Connection;
}

/** State that TabItem needs:
 * is the tab the active tab?
 * tabId, connection metadata (as of right now specifically the label, or user@hostname -> this is probably the better approach)
 * I still want the tab bar to manage state like active tab etc, so may have to refactor some things
 */
export default function TabItem({ activeTab }) {
    return <span
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
            </span>;
}