import { type User } from '../types';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Dropdown from './Dropdown';

type ProfileCardProps = {
    currentUser: User;
}

// convert log out button to <a href=/logout ></a>
export default function ProfileCard({ currentUser }: ProfileCardProps) {
    const navigate = useNavigate();
    const handleLogOff = async () => {
        const res = await fetch(`${config.api.url}${config.api.routes.auth.logoff}`, {
            method: "POST",
            credentials: "include"
        });
        if (!res.ok) {
            console.log(`Something went wrong`); // will make a toast saying "successfully sign out or failed to sign out"
        }
        else {
            navigate(0); // refresh works, could just navigate directly to login, but we'll see how i implement
        }
    }
    return (
        <div className="profile-card">
            <Dropdown triggerLabel={currentUser.username} items={[{ "content": "Profile" },
            { "content": <a href='#' onClick={() => handleLogOff()}>Log Out</a> }
            ]} />
        </div>
    );
}