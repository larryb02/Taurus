import { useEffect } from "react";
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';
import ConnectionView from "../components/ConnectionView";
import { useConnectionsContext } from "../context/ConnectionsContext";
import { useUserContext } from "../context/UserContext";
import { config } from "../config";
import { type User } from "../types";


export default function Dashboard() {

    const { setConnections } = useConnectionsContext();
    const { setCurrentUser } = useUserContext();


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${config.api.url}${config.api.routes.auth.user}`, {
                    credentials: "include"
                });
                const json = await res.json();
                if (!res.ok) {
                    throw new Error(`No user signed in.`);
                }
                const user: User = {
                    userId: json['result']['user_id'],
                    email: json['result']['email_address'],
                    username: json['result']['username']
                };
                setCurrentUser(user);

                // NOTE: fetching connections after getting user works for now, 
                // but consider moving this to a function in ConnectionsContext
                const res2 = await fetch(`${config.api.url}${config.api.routes.ssh.connection}`, {
                    credentials: "include"
                });
                const json2 = await res2.json();
                setConnections(json2["results"]);
            } catch (error) {
                throw new Error(`Failed to fetch ${error}`);
            }
        }
        fetchUser();
    }, []);



    return (
        <div className="dashboard">
            <Header />
            <div className="dashboard-view">
                <Sidebar />
                <ConnectionView />
            </div>
        </div>
    );
}
