import { useState, createContext, useContext, type ReactNode } from "react";
import { type Connection } from "../types";

type Props = {
    children: ReactNode;
};

interface SessionsContextInterface {
    getActiveSession: () => Connection | null;
    setActiveSession: (value: Connection) => void;
}

const SessionsContext = createContext<SessionsContextInterface | null>(null);

export const SessionsContextProvider: React.FC<Props> = ({ children }) => {
    const [activeSession, setActiveSession] = useState<Connection | null>(null);

    function getActiveSession(): Connection | null { // i definitely need to test this.
        if (!activeSession) {
            console.warn("No sessions active");
            return null;
        }
        return activeSession;
    }
    
    return (
        <SessionsContext value={{ getActiveSession, setActiveSession }}>
            {children}
        </SessionsContext>
    );
}

export const useSessionsContext = () => {
    const ctx = useContext(SessionsContext);

    if (!ctx) {
        throw new Error("SessionsContext must be used within a SessionsContext Provider");
    }

    return ctx;
}