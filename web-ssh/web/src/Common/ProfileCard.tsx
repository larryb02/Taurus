import { type User } from '@taurus/types';
import { config } from '@taurus/config';
import { useNavigate } from 'react-router-dom';
// import Dropdown from '@taurus/Common/Dropdown';
import { Avatar, Menu, Box, IconButton, MenuItem } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { useState } from 'react';

type ProfileCardProps = {
    currentUser: User;
}

// convert log out button to <a href=/logout ></a>
export default function ProfileCard({ currentUser }: ProfileCardProps) {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
        // <div className="profile-card">
        //     <Dropdown triggerLabel={currentUser.username} items={[
        //         { "content": <a href='#' onClick={() => handleLogOff()}>Log Out</a> }
        //     ]} />
        // </div>
        <>
            <Box>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ bgcolor: deepPurple[500] }}>{currentUser.username[0]}</Avatar>
                </IconButton>
            </Box>
            <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
            >
                <MenuItem>Profile</MenuItem> {/** does nothing currently */}
                <MenuItem onClick={handleLogOff}>Log Out</MenuItem>
            </Menu>
        </>
    );
}