import { createContext, useContext, useState, type ReactNode } from "react";
import type { Connection } from "../types";

type Props = {
    children: ReactNode;
};

interface ConnectionContextInterface {
    connections: Connection[];
    addConnection: (value: Connection) => void;
}

const ConnectionsContext = createContext<ConnectionContextInterface | null>(null);

export const ConnectionsContextProvider: React.FC<Props> = ({ children }) => {
    const [connections, setConnections] = useState<Connection[]>([
            { label: "test-server-1", host: "testvm1", user: "yo" },
            { label: "prod-server-1", host: "prodvm1", user: "yo" },
        ]);


    function addConnection(conn: Connection) {
        setConnections(prev => [...prev, conn]);
    }

    return (
        <ConnectionsContext value={{ connections, addConnection }}>
            {children}
        </ConnectionsContext>
    );
};

export function useConnectionsContext() {
    const connectionCtx = useContext(ConnectionsContext);
    if (!connectionCtx) {
        throw new Error(`ConnectionsContext must be used within a ConnectionsContext Provider`);
    }
    return connectionCtx;
}