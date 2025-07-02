// This is where Terminals will be mounted, will be a window with tab functionality, split screen functionality, etc in the future
// For now just dealing with one terminal
import Header from '@taurus/Common/Header';
import Terminal from './Terminal'
import TabBar from './TabBar';

export default function TerminalView() {
    // need to identify and render active session/s

    // const { connection_id } = session;
    return (
        <div className="terminal-view">
            <Header />
            <div className="view">
                <TabBar />
                <Terminal />
            </div>
        </div>
    );


}