import { useState } from "react";
// import { socket } from '../socket';
import buttons from '../styles/buttons.module.css'
// import Terminal from '../components/Terminal';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import page from '../page.module.css'
import ConnectionForm from "../components/ConnectionForm";
import ConnectionItem from "../components/ConnectionItem";
import { useConnectionsContext } from "../context/ConnectionContext";

export default function Dashboard() {
    // Get all connections from db and render
    // when user clicks a connection, trigger a new ssh session
    // eventually this will also have options to delete etc

    const [isAddingConnection, setIsAddingConnection] = useState<boolean>(false); // add connection button
    const { connections } = useConnectionsContext();

    if (isAddingConnection) {
        // we'll do some css magic here -> like a nice animation to render a panel
        // but for now we'll do this
        return (
            <div className={page.top_level}>
                <Header />
                {/* <ConnectionsProvider> */}
                    <ConnectionForm setIsAddingConnection={setIsAddingConnection} />
                {/* </ConnectionsProvider> */}
            </div>
        )
    }

    return (
        // <ConnectionsProvider>
            <div className={page.top_level}>
                <Header />
                <button className={buttons.default_button} onClick={() => {
                    setIsAddingConnection(true);
                }}>New Connection</button>
                <div className={page.page}>
                    {/* <Sidebar /> */}
                    {connections.map((item) =>
                        <ConnectionItem connection={item}/>
                    )}
                </div>
            </div>
        // </ConnectionsProvider>
    );
}
