import header from '../styles/header.module.css'
import { useNavigate } from 'react-router-dom';


export default function Header() {
    const nav = useNavigate();
    return (<div className={header.header}>
        <span className={header.title}>Alpha</span>
        <span> {/* If logged in render profile card, otherwise render login button*/}
            <button onClick={() => nav("/login")}>Log In</button></span>
    </div>);
}