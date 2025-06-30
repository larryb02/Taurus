import { useState } from "react";
import { updateField } from "../utils";
import { config } from "../config";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { Button, Link } from "@mui/material";
// import '../styles/Login.css';
import { Stack, TextField, Typography } from "@mui/material";

interface UserLoginForm {
    email: string;
    password: string;
}

interface NewUserForm {
    emailAddress: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export default function Login() {
    let navigate = useNavigate();
    const [userData, setUserData] = useState<UserLoginForm>({
        email: "",
        password: ""
    });

    const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);

    const [newUserData, setNewUserData] = useState<NewUserForm>({
        emailAddress: "",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState<string | null>(null);

    const signIn = async () => {
        try {
            const res = await fetch(`${config.api.url}${config.api.routes.auth.login}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        "email_or_user": userData.email,
                        "password": userData.password
                    }),
                    headers: {
                        "content-type": "application/json"
                    },
                    credentials: "include"
                }
            );
            if (!res.ok) {
                const statusCode = res.status;
                switch (statusCode) {
                    case 403:
                        setError("Incorrect username or password.");
                        break;
                    default:
                        setError("Something went wrong, please try again.");
                        break;
                }
                throw new Error(`Failed to fetch: {
                    Status Code: ${res.status}
                    Msg: ${res.statusText}}`);
            }
            const data = await res.json();
            console.log(data);
        } catch (error) {
            setError("Internal Server Error, please try again.");
            throw new Error(`Failed to fetch: {
                Route: ${config.api.routes.auth.login}
                Error: ${error}}`
            );
        }

        navigate("/dashboard");
    }

    const createAccount = async () => {
        if (newUserData.password !== newUserData.confirmPassword) {
            console.log("Passwords do not match.");
            return;
        }
        try {
            const res = await fetch(`${config.api.url}${config.api.routes.auth.user}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        "email": newUserData.emailAddress,
                        "username": newUserData.username,
                        "password": newUserData.password
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
            else {
                console.log("Successfully created new account");
                setNewUserData({
                    emailAddress: "",
                    username: "",
                    password: "",
                    confirmPassword: ""
                });
                console.log(userData)
                setIsCreatingAccount(false);
            }
        } catch (error) {
            throw new Error(`Failed to fetch: {
                Route: ${config.api.routes.auth.user}
                Error: ${error}}`
            );
        }
    }

    if (isCreatingAccount) {
        return (
            <div className="login-page">
                <div className="login-form">
                    <button onClick={() => setIsCreatingAccount(false)}>Return</button>
                    <div className="login-field">
                        <input type="text" placeholder="Email Address" onChange={
                            (e) => {
                                updateField(newUserData, setNewUserData, "emailAddress", e.target.value)
                                console.log(newUserData);
                            }
                        }>
                        </input>
                    </div>
                    <div className="login-field">
                        <input type="text" placeholder="Username" onChange={
                            (e) => updateField(newUserData, setNewUserData, "username", e.target.value)
                        }>
                        </input>
                    </div>
                    <div className="login-field">
                        <input type="password" placeholder="Password" onChange={
                            (e) => updateField(newUserData, setNewUserData, "password", e.target.value)
                        }>
                        </input>
                    </div>
                    <div className="login-field">
                        <input type="password" placeholder="Confirm Password" onChange={
                            (e) => updateField(newUserData, setNewUserData, "confirmPassword", e.target.value)
                        }>
                        </input>
                    </div>
                    <div className="login-action">
                        <button onClick={() => createAccount()}>Create</button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                bgcolor: '#121212',
                px: 2,
                width: '100%'
            }}
        >
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
                        Log In
                    </Typography>

                    {/* {error && <Alert severity="error">{error}</Alert>} */}

                    <TextField
                        sx={{
                            color: 'white',
                            bgcolor: 'white'
                        }}
                        size="small"
                        label="Email"
                        name="email"
                        type="email"
                        // value={form.email}
                        // onChange={(e) => setForm({ ...form, email: e.target.value })}
                        fullWidth
                    // required
                    />

                    <TextField
                        sx={{
                            color: 'white',
                            bgcolor: 'white'
                        }}
                        size="small"
                        label="Password"
                        name="password"
                        type="password"
                        // value={form.password}
                        // onChange={(e) => setForm({ ...form, password: e.target.value })}
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
        </Box>
        // <div className="login-page">
        //     <div className="login-form">
        //         <div className="login-field">
        //             {/* <label>Username</label> */}
        //             <input type="text" placeholder="Email Address" onChange={
        //                 (e) => updateField(userData, setUserData, "email", e.target.value)
        //             }>
        //             </input>
        //         </div>
        //         <div className="login-field">
        //             {/* <label>Password</label> */}
        //             <input type="password" placeholder="Password" onChange={
        //                 (e) => updateField(userData, setUserData, "password", e.target.value)
        //             }>
        //             </input>
        //         </div>
        //         {error !== null &&
        //             <div className="error-msg">
        //                 {error}
        //             </div>
        //         }
        //         <div className="login-action">
        //             {/* <button onClick={() => setIsCreatingAccount(true)}>Create Account</button> */}
        //             <a className="" href="#" onClick={(e) => {
        //                 e.preventDefault(); // Prevent page jump
        //                 setIsCreatingAccount(true);
        //             }}>
        //                 Create Account
        //             </a>
        //             <button onClick={() => signIn()}>Sign In</button>
        //         </div>
        //     </div>
        // </div>
    );
}