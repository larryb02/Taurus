import Term from '@taurus/lib/Terminal/Terminal';
import { useEffect, useState, useRef } from 'react';
import { useSessionsContext } from '@taurus/Terminal/SessionsContext';
import '@taurus/styles/terminal.css';

export default function SshSession() {
    const [error, setError] = useState<string | null>(null);
    const termRef = useRef<Term>(null);
    const { getActiveSession } = useSessionsContext();
    const activeSession = getActiveSession();
    if (activeSession) { // i will probably want to rerender on session change
        useEffect(() => {
            (async () => {
                termRef.current = new Term({
                    connectionId: activeSession.connection_id,
                    el: document.getElementById('terminal')
                });
                const status = await termRef.current?.createNewSession();

                if (status === true) {
                    termRef.current?.open();
                }
                else {
                    console.error("Failed to open");
                    setError("Failed to establish connection");
                }
            })();

            return () => {
                console.log("Cleanup called");
                termRef.current?.close();
            };
        }, []);

        if (error) {
            return <div className="error-message">{error}</div>
        }

        return (
            <div id="terminal"></div>
        );
    }
}