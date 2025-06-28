// This is where Terminals will be mounted, will be a window with tab functionality, split screen functionality, etc in the future
// For now just dealing with one terminal
import Header from '@taurus/Common/Header';
import Terminal from './Terminal'
import { useSessionsContext } from '@taurus/context/SessionsContext';
import TabBar from './TabBar';

export default function TerminalView() {
    // need to identify and render active session/s

    const { sessions } = useSessionsContext();
    console.log(sessions);

    if (sessions.length > 0) {
        // const { connection_id } = session;
        return (
            <div className="terminal-view">
                <Header />
                <div className="view">
                    <TabBar />
                    <Terminal sshConnectionData={
                        // "label": label,
                        // "user": user,
                        // "hostname": hostname,
                        // "pass": "password"
                        // connection_id,
                        4
                    } />
                </div>
            </div>
        );
    }

}