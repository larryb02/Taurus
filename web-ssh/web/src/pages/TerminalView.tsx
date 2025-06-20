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

    const { label, user, hostname } = session;
    return (
        <div className="">
            <Header />
            <div className="">
                <Sidebar />
                <div className="">
                    <Terminal sshConnectionData={{
                        "label": label,
                        "user": user,
                        "hostname": hostname,
                        "pass": "password"
                    }} sessionStarted={true} />
                </div>
            </div>
        </div>
    );
}