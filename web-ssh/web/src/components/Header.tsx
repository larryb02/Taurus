import header from '../styles/header.module.css' // note this will no longer be a module
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';


export default function Header() {
    const { currentUser } = useUserContext();
    const nav = useNavigate();
    return (<div className={header.header}>
        <span className={header.title}>Alpha</span>
        <span className={header.profileCard}>
            {currentUser !== null &&
                <div>{currentUser.username}</div>
                ||
                <button onClick={() => nav("/login")}>Log In</button>
            }
        </span>
    </div>);
}