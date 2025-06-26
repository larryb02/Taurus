// This is where Terminals will be mounted, will be a window with tab functionality, split screen functionality, etc in the future
// For now just dealing with one terminal
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Terminal from '../components/Terminal'
import { useSessionsContext } from '../context/SessionsContext';

export default function TerminalView() {
    // need to identify and render active session/s

    const { getActiveSession } = useSessionsContext();
    const session = getActiveSession();
    if (session) {
        const { connection_id } = session;
        return (
            <div className="terminal-view">
                <Header />
                <div className="view">
                    {/* <Sidebar /> */}
                    {/* <div className="container"> */}
                    <Terminal sshConnectionData={
                        // "label": label,
                        // "user": user,
                        // "hostname": hostname,
                        // "pass": "password"
                        connection_id
                    } />
                    {/* </div> */}
                </div>
            </div>
        );
    }

}