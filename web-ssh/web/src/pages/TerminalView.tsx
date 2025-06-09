// This is where Terminals will be mounted, will be a window with tab functionality, split screen functionality, etc in the future
// For now just dealing with one terminal
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import page from '../page.module.css'; // these should probably be globals
import termStyles from '../styles/terminal.module.css';
import Terminal from '../components/Terminal'
import { useSessionsContext } from '../context/SessionsContext';


export default function TerminalView() {
    // need to identify and render active session/s

    const { getActiveSession } = useSessionsContext();
    const session = getActiveSession();

    const { label, user, host } = session;
    return (
        <div className={page.top_level}>
            <Header />
            <div className={page.page}>
                <Sidebar />
                <div className={termStyles.terminal_view}>
                    <Terminal sshConnectionData={{
                        "label": label,
                        "user": user,
                        "hostname": host,
                        "pass": "password"
                    }} sessionStarted={true} />
                </div>
            </div>

        </div>
    );
}