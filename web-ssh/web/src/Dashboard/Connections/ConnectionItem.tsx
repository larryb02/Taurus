import { type Connection } from "@taurus/types";
import { useNavigate } from "react-router-dom";
import '@taurus/styles/Connections/ConnectionItem.css';
import { useSessionsContext } from '@taurus/context/SessionsContext';
import Dropdown from "@taurus/Common/Dropdown";

interface ConnectionItemProps {
    connection: Connection;
}

export default function ConnectionItem({ connection }: ConnectionItemProps) {
    const nav = useNavigate();
    const { dispatch } = useSessionsContext();
    return (
        <div className="connection_item">
            <div className="connection_details">{connection.label}</div>
            <div className="connect-button">
                <button onClick={() => {
                    console.log(`Launching ${JSON.stringify(connection)}`);
                    dispatch({
                        type: 'update',
                        payload: connection
                    });
                    nav("/session"); {/* bare minimum to start a terminal */ }
                }}>Connect
                </button>
                <Dropdown triggerLabel=":" items={[{
                    "content": "Edit"
                }, {
                    "content": "Remove"
                }]} />
            </div>
        </div>
    );
}