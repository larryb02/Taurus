import Term from '@taurus/lib/Terminal/Terminal';
import { useEffect, useState, useRef } from 'react';
import '@taurus/styles/terminal.css';

interface terminalProps {
    sshConnectionData: number;
}

export default function SshSession({ sshConnectionData }: terminalProps) { // need to resolve naming conflicts...
    const [error, setError] = useState<string | null>(null);
    const termRef = useRef<Term>(null);

    useEffect(() => {
        // openTerm(); // only for testing
        (async () => {
            termRef.current = new Term({
                connectionId: sshConnectionData,
                el: document.getElementById('terminal')
            }); // change sshConnectionData to connectionId
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