import { createContext, useContext, useState, type ReactNode } from "react";
import type { Connection } from "../types";

type Props = {
    children: ReactNode;
};

interface ConnectionContextInterface {
    connections: Connection[];
    addConnection: (value: Connection) => void;
    setConnections: (value: Connection[]) => void;
}

const ConnectionsContext = createContext<ConnectionContextInterface | null>(null);

export const ConnectionsContextProvider: React.FC<Props> = ({ children }) => {
    const [connections, setConnections] = useState<Connection[]>([]);


    function addConnection(conn: Connection) {
        setConnections(prev => [...prev, conn]);
    }

    return (
        <ConnectionsContext value={{ connections, addConnection, setConnections }}>
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