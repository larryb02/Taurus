import { createContext, useContext, useState, type ReactNode } from "react";
import type { Connection } from "@taurus/types";

type Props = {
    children: ReactNode;
};

interface ConnectionContextInterface {
    connections: Connection[];
    addConnection: (value: Connection) => void;
    setConnections: (value: Connection[]) => void;
    removeConnection: (value: Connection) => void;
}

const ConnectionsContext = createContext<ConnectionContextInterface | null>(null);

export const ConnectionsContextProvider: React.FC<Props> = ({ children }) => {
    const [connections, setConnections] = useState<Connection[]>([]);


    function addConnection(conn: Connection) {
        setConnections(prev => [...prev, conn]);
    }
    const removeConnection = (conn: Connection) => {
        setConnections(prev => {
            const cpy = [...prev];
            const idx = cpy.indexOf(conn);
            if (idx >= 0) {
                console.log(`Connection[${idx}]: ${JSON.stringify(cpy[idx])}`);
            } 
            else {
                console.warn(`Index: ${idx}`);
            }
            const el = cpy.splice(idx, 1);
            console.log(`Removed ${JSON.stringify(el)} from ${JSON.stringify(cpy)}`);
            return cpy;
        })
    }

    return (
        <ConnectionsContext value={{ connections, addConnection, setConnections, removeConnection }}>
            {children}
        </ConnectionsContext>
    );
};

export const useConnectionsContext = () => {
    const ctx = useContext(ConnectionsContext);
    if (!ctx) {
        throw new Error(`ConnectionsContext must be used within a ConnectionsContext Provider`);
    }
    return ctx;
}