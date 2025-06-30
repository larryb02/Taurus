import { Stack, TextField, Alert, Typography, Button, Box, Container } from "@mui/material";
import { useState } from 'react';
import { updateField } from "../utils";
import { config } from "@taurus/config";

type NewUserForm = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export default function SignUpForm() {
    const [signUpProps, setSignUpProps] = useState<NewUserForm>({
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    })

    const [error, setError] = useState<string | null>(null);

    const validate = (input: NewUserForm) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!input.email || !regex.test(input.email)) {
            return false;
        }
        if (!input.password) { // don't have guidelines for strong password yet so no regex here
            return false;
        }
        if (!input.confirmPassword) {
            return false;
        }
        if (input.password !== input.confirmPassword) {
            return false;
        }
        return true;
    }

    const signUp = async () => {
        if (signUpProps.password !== signUpProps.confirmPassword) {
            console.log("Passwords do not match.");
            return;
        }
        try {
            const res = await fetch(`${config.api.url}${config.api.routes.auth.user}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        "email": signUpProps.email,
                        "username": signUpProps.username,
                        "password": signUpProps.password
                    }),
                    headers: {
                        "content-type": "application/json",
                    }
                }
            );
            if (!res.ok) {
                setError("Failed to create user, please try again.");
                throw new Error(`Failed to fetch: {
                    Status Code: ${res.status}
                    Msg: ${res.statusText}}`);
            }
            else { // on success display toast and redirect to login
                console.log("Successfully created new account");
                setSignUpProps({
                    email: "",
                    username: "",
                    password: "",
                    confirmPassword: ""
                });
                console.log(signUpProps);
            }
        } catch (error) {
            throw new Error(`Failed to fetch: {
                Route: ${config.api.routes.auth.user}
                Error: ${error}}`
            );
        }
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
                    e.preventDefault();
                    if (!validate(signUpProps)) {
                        setError("Username or Password is invalid"); // okay make this more fine grained
                        return;
                    }
                    signUp();
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
                        onChange={(e) => {
                            if (error) {
                                setError(null);
                            }
                            updateField(signUpProps, setSignUpProps, "username", e.target.value)
                        }}
                        autoFocus

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
                        onChange={(e) => {
                            if (error) {
                                setError(null);
                            }
                            updateField(signUpProps, setSignUpProps, "email", e.target.value)
                        }}

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
                        onChange={(e) => {
                            if (error) {
                                setError(null);
                            }
                            updateField(signUpProps, setSignUpProps, "password", e.target.value)
                        }}
                    // error={true}
                    // helperText={"this is a test"}

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
                        onChange={(e) => {
                            if (error) {
                                setError(null);
                            }
                            updateField(signUpProps, setSignUpProps, "confirmPassword", e.target.value)
                        }}

                    ></TextField>
                    <Button color="success" type="submit" variant="contained" fullWidth>
                        Sign Up
                    </Button>
                </Stack>
            </Box>
        </Container>
    )
}