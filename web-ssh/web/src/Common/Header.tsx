import '@taurus/styles/header.css' // note this will no longer be a module
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@taurus/Auth/UserContext';
import ProfileCard from './ProfileCard';

export default function Header() {
    const { currentUser } = useUserContext();
    const nav = useNavigate();
    return (<div className="header">
        <span className="">Alpha</span>
        <span className="">
            {currentUser !== null &&
                <ProfileCard currentUser={currentUser}/>
            }
        </span>
    </div>);
}