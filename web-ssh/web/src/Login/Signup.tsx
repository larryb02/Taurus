import Box from '@mui/material/Box';
import { Stack, TextField, Alert, Typography, Button } from "@mui/material";
import { useState } from 'react';
import { updateField } from "../utils";

type NewUserForm = {
    emailAddress: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export default function SignUp() {
    const [signUpProps, setSignUpProps] = useState<NewUserForm>({
        emailAddress: "",
        username: "",
        password: "",
        confirmPassword: ""
    })

    const [error, setError] = useState(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        updateField(signUpProps, setSignUpProps, field, e.target.value)
        console.log(signUpProps);
    }
    return <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        bgcolor: '#121212',
        px: 2,
        width: '100%'
    }}>
        <Box
            component="form"
            // onSubmit={handleSubmit}
            sx={{
                width: '100%',
                maxWidth: 400,
                bgcolor: '#1e1e1e',
                color: 'white',
                p: 4,
                borderRadius: 2,
                boxShadow: 4,
            }}
        >

            <Stack spacing={2}>
                <Typography sx={{
                    color: 'white'
                }} variant="h5" textAlign="center">
                    Sign Up
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    margin="dense"
                    size="small"
                    variant="outlined"
                    slotProps={{
                        inputLabel: { shrink: true }
                    }
                    }
                    sx={{
                        bgcolor: 'white',
                        // bgcolor: 'white'
                    }}
                    placeholder="Username"
                    onChange={(e) => handleChange(e, "username")}

                ></TextField>
                <TextField
                    margin="dense"
                    size="small"
                    variant="outlined"
                    slotProps={{
                        inputLabel: { shrink: true }
                    }
                    }
                    sx={{
                        bgcolor: 'white',
                        // bgcolor: 'white'
                    }}
                    placeholder="Email Address"
                    onChange={(e) => handleChange(e, "emailAddress")}

                ></TextField>
                <TextField
                    margin="dense"
                    size="small"
                    variant="outlined"
                    slotProps={{
                        inputLabel: { shrink: true }
                    }
                    }
                    sx={{
                        bgcolor: 'white',
                        // bgcolor: 'white'
                    }}
                    placeholder="Password"
                    type="password"
                    onChange={(e) => handleChange(e, "password")}

                ></TextField>
                <TextField
                    margin="dense"
                    size="small"
                    variant="outlined"
                    slotProps={{
                        inputLabel: { shrink: true }
                    }
                    }
                    sx={{
                        bgcolor: 'white',
                        // bgcolor: 'white'
                    }}
                    placeholder="Confirm Password"
                    type="password"
                    onChange={(e) => handleChange(e, "confirmPassword")}

                ></TextField>


                <Button color="success" type="submit" variant="contained" fullWidth>
                    Sign Up
                </Button>
            </Stack>
        </Box>
    </Box>
}