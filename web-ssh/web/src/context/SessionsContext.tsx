import { useState, createContext, useContext, type ReactNode } from "react";
import { type Connection } from "../types";

type Props = {
    children: ReactNode;
};

interface SessionsContextInterface {
    getActiveSession: () => Connection;
    setActiveSession: (value: Connection) => void;
}

const SessionsContext = createContext<SessionsContextInterface | null>(null);

export const SessionsContextProvider: React.FC<Props> = ({ children }) => {
    const [activeSession, setActiveSession] = useState<Connection | null>(null);

    function getActiveSession(): Connection { // i definitely need to test this.
        if (!activeSession) {
            throw new Error("Active Session is null");
        }
        return activeSession;
    }
    
    return (
        <SessionsContext value={{ getActiveSession, setActiveSession }}>
            {children}
        </SessionsContext>
    );
}

export function useSessionsContext() {
    const ctx = useContext(SessionsContext);

    if (!ctx) {
        throw new Error("SessionsContext must be used within a SessionsContext Provider");
    }

    return ctx;
}