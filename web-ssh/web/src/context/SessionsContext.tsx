import { useState, useReducer, createContext, useContext, type ReactNode } from "react";
import { type Connection } from "../types";

type Props = {
    children: ReactNode;
};

interface SessionsContextInterface {
    // getActiveSession: () => Connection | null;
    // getActiveSessions: () => Connection[];
    // setActiveSession: (value: Connection) => void;
    sessions: Connection[];
    dispatch: React.Dispatch<Action>;
}

type Action =
    {
        type: 'update'
        payload: Connection
    } | {
        type: 'remove'
        payload: Connection
    };

const SessionsContext = createContext<SessionsContextInterface | null>(null);

const reducer = (sessions: Connection[], action: Action): Connection[] => {
    const ac = action.type; // hack for debugging, unless i find a workaround
    switch (ac) {
        case 'update': {
            return [
                ...sessions,
                action.payload
            ];
        }
        // case 'set': {
        //     return [
        //      action.sessions   
        //     ];
        // }
        case 'remove': {
            return sessions.filter((conn) => {
                return conn !== action.payload;
            });
        }
        default: {
            console.warn(`Failed to process ${ac}`);
            return sessions;
        }
    }
}

export const SessionsContextProvider: React.FC<Props> = ({ children }) => {
    const [activeSession, setActiveSession] = useState<Connection | null>(null);
    const [sessions, dispatch] = useReducer(reducer, []);

    function getActiveSession(): Connection | null { // i definitely need to test this.
        if (!activeSession) {
            console.warn("No sessions active");
            return null;
        }
        return activeSession;
    }

    return (
        <SessionsContext value={{ sessions, dispatch }}>
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