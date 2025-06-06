import { type Connection } from "../types";
import '../styles/ConnectionItem.css';

interface ConnectionItemProps {
    connection: Connection;
}
export default function ConnectionItem({ connection }: ConnectionItemProps) {
    return (
        <div className="connection_item">
                <div className="connection_details">{connection.label}</div>
                <button onClick={() => {
                    console.log(`Launching ${JSON.stringify(connection)}`);
                }}>Connect</button>
            {/* 
            <button>Options</button> */}
        </div>
    );
}