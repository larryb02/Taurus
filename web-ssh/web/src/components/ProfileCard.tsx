import { type User } from '../types';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';

type ProfileCardProps = {
    currentUser: User;
}

export default function ProfileCard({ currentUser }: ProfileCardProps) {
    const navigate = useNavigate();
    const handleLogOff = async () => {
        const res = await fetch(`${config.api.url}${config.api.routes.auth.logoff}`, {
            method: "POST",
            credentials: "include"
        });
        if (!res.ok) {
            console.log(`Something went wrong`);
        }
        else {
            navigate(0); // refresh works, could just navigate directly to login, but we'll see how i implement
        }
    }
    return (
        <div>
            <div>{currentUser.username}</div>
            <button onClick={() => handleLogOff()}>Log Off</button>
        </div>
    );
}