import '../styles/header.css' // note this will no longer be a module
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import ProfileCard from './ProfileCard';

export default function Header() {
    const { currentUser } = useUserContext();
    const nav = useNavigate();
    return (<div className="header">
        <span className="">Alpha</span>
        <span className="">
            {currentUser !== null &&
                // <div>{currentUser.username}</div>
                <ProfileCard currentUser={currentUser}/>
                ||
                <button onClick={() => nav("/login")}>Log In</button>
            }
        </span>
    </div>);
}