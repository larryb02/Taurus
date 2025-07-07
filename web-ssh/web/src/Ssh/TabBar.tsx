import { useSessionsContext } from '@taurus/Ssh/SshSessionContext';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import type { Connection } from '@taurus/types';

export default function TabBar() {
    const { getActiveSession } = useSessionsContext();
    const {connection_id, username, hostname} = getActiveSession() as Connection;
    const [value, setValue] = useState(0);

    const handleChange = () => {

    }

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange}>
                <Tab value={value} label={`${username}@${hostname}`} sx={{
                    color: 'gray',
                    '&.Mui-selected': {
                        color: 'white',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #90caf9',
                    },
                }}>
                </Tab>
            </Tabs>
        </Box>
    );
}