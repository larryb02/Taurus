import { type Connection } from "../types";
import { useNavigate } from "react-router-dom";
import '../styles/ConnectionItem.css';
import { useSessionsContext } from '../context/SessionsContext';


interface ConnectionItemProps {
    connection: Connection;
}

export default function ConnectionItem({ connection }: ConnectionItemProps) {
    const nav = useNavigate();
    const { setActiveSession } = useSessionsContext();
    return (
        <div className="connection_item">
                <div className="connection_details">{connection.label}</div>
                <button onClick={() => {
                    console.log(`Launching ${JSON.stringify(connection)}`);
                    setActiveSession(connection);
                    nav("/session"); {/* bare minimum to start a terminal */}
                }}>Connect</button>
            {/* 
            <button>Options</button> */}
        </div>
    );
}