import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { updateField } from '@taurus/utils';
import { config } from '@taurus/config';
import { useMutation } from '@tanstack/react-query';

type UserLoginForm = {
    email: string;
    password: string;
}
const handleChange = () => {
    // TODO: create a handler that can update the field that got changed
}
const signIn = async (email: string, password: string) => {
    const res = await fetch(`${config.api.url}${config.api.routes.auth.login}`,
        {
            method: "POST",
            body: JSON.stringify({
                "email_or_user": email,
                "password": password
            }),
            headers: {
                "content-type": "application/json"
            },
            credentials: "include"
        }
    );
    if (!res.ok) {
        console.error(`Error signing in ${res.status}, ${res.statusText}`);
        throw new Error(`${res.status}`);
    }
    return res.json();
}
export default function LoginForm() {
    // TODO: start defining callbacks outside of mutation hook

    const [userData, setUserData] = useState<UserLoginForm>({
        email: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: () => signIn(userData.email, userData.password), onSuccess() {
            console.log("successfully signed in");
            navigate("/dashboard");
        }, onError(error) {
            console.error(`Failed to log in error: ${error}`);
            setError("Failed to log in");
        }
    });
    const validate = (input: UserLoginForm) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!input.email || !regex.test(input.email)) {
            return false;
        }
        // TODO: add password constraints:
        // min-length = 5 characters
        if (!input.password) {
            return false;
        }
        return true;
    }


    return (

        <Container maxWidth={false} disableGutters
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                bgcolor: '#121212',
                px: 2,
                maxWidth: '100vw'
            }}>
            <Box
                action="?"
                component="form"
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    bgcolor: '#1e1e1e',
                    color: 'white',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 4,
                }}
                onSubmit={(e) => {
                    console.log("submitting form.")
                    e.preventDefault();
                    if (!validate(userData)) {
                        setError("Username or Password is invalid"); // okay make this more fine grained
                        return;
                    }
                    mutation.mutate();
                }}
            >
                <Stack spacing={2}>
                    <Typography sx={{
                        color: 'white'
                    }} variant="h5" textAlign="center">
                        Log In
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        sx={{
                            color: 'white',
                            bgcolor: 'white'
                        }}
                        size="small"
                        placeholder="Email Address"
                        name="email"
                        type="email"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        onChange={(e) => {
                            if (error) {
                                setError(null);
                            }
                            updateField(userData, setUserData, "email", e.target.value)
                        }}
                        fullWidth
                    // required
                    />

                    <TextField
                        sx={{
                            color: 'white',
                            bgcolor: 'white'
                        }}
                        size="small"
                        placeholder="Password"
                        name="password"
                        type="password"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        onChange={(e) => {
                            if (error) {
                                setError(null);
                            }
                            updateField(userData, setUserData, "password", e.target.value)
                        }}
                        fullWidth
                    // required
                    />
                    <Link variant="subtitle2">Forgot password?</Link>
                    <Button color="success" type="submit" variant="contained" fullWidth>
                        Sign In
                    </Button>
                    <Typography variant="subtitle2">
                        Don't have an account? <Link href='/signup'>Sign Up</Link>
                    </Typography>
                </Stack>
            </Box>
        </Container>

    )
}