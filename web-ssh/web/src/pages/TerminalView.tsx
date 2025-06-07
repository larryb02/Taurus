// This is where Terminals will be mounted, will be a window with tab functionality, split screen functionality, etc in the future
// For now just dealing with one terminal
import Header from '../components/Header';
import page from '../page.module.css'; // these should probably be globals
import Terminal from '../components/Terminal'
import { useSessionsContext } from '../context/SessionsContext';


export default function TerminalView() {
    // need to identify and render active session/s

    const { getActiveSession } = useSessionsContext();
    const session = getActiveSession();
    if (!session) {
        throw new Error("Active session is null"); // seems pretty hacky i will need to find a workaround, 
                                                    // but in theory this **should** never happen.
    }
    const { label, user, host } = session;
    return (
        <div className={page.top_level}>
            <Header />
            <div className="terminal-view">
                <Terminal sshConnectionData={{
                    "label": label,
                    "user": user,
                    "hostname": host,
                    "pass": "password"
                }} sessionStarted={true} />
            </div>
        </div>
    );
}