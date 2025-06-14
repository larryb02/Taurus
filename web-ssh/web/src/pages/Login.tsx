import { useState } from "react";
import { updateField } from "../utils";
import { config } from "../config";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

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
                throw new Error(`Failed to fetch: {
                    Status Code: ${res.status}
                    Msg: ${res.statusText}}`);
            }

            const data = await res.json();
            console.log(data);
            // try {
            //     const res = await fetch(`${config.api.url}${config.api.routes.auth.user}`, {
            //         credentials: "include"
            //     });
            //     const json = await res.json();
            //     console.log(json);
            //     // return json;
            // } catch (error) {
            //     throw new Error(`Failed to fetch ${error}`);
            // }

        } catch (error) {
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
            const res = await fetch(`${config.api.url}${config.api.routes.auth.create}`,
                {
                    method: "POST",
                    body: JSON.stringify(newUserData),
                    headers: {
                        "content-type": "application/json"
                    }
                }
            );

            if (!res.ok) {
                throw new Error(`Failed to fetch: {
                    Status Code: ${res.status}
                    Msg: ${res.statusText}}`);
            }

            const data = await res.json();
            console.log(data);

        } catch (error) {
            throw new Error(`Failed to fetch: {
                Route: ${config.api.routes.auth.create}
                Error: ${error}}`
            );
        }
    }

    if (isCreatingAccount) {
        return (
            <div>
                <button onClick={() => setIsCreatingAccount(false)}>Return</button>
                <div className="login-field">
                    {/* <label>Username</label> */}
                    <input type="text" placeholder="Email" onChange={
                        (e) => updateField(userData, setUserData, "email", e.target.value)
                    }>
                    </input>
                </div>
                <div>
                    <label>Username</label>
                    <input type="text" onChange={
                        (e) => updateField(newUserData, setNewUserData, "username", e.target.value)
                    }>
                    </input>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" onChange={
                        (e) => updateField(newUserData, setNewUserData, "password", e.target.value)
                    }>
                    </input>
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" onChange={
                        (e) => updateField(newUserData, setNewUserData, "confirmPassword", e.target.value)
                    }>
                    </input>
                </div>
                <button onClick={() => createAccount()}>Create</button>
            </div>
        );
    }
    return (
        <div className="login-page">
            <div className="login-form">
                <div className="login-field">
                    {/* <label>Username</label> */}
                    <input type="text" placeholder="Email Address" onChange={
                        (e) => updateField(userData, setUserData, "email", e.target.value)
                    }>
                    </input>
                </div>
                <div className="login-field">
                    {/* <label>Password</label> */}
                    <input type="password" placeholder="Password" onChange={
                        (e) => updateField(userData, setUserData, "password", e.target.value)
                    }>
                    </input>
                </div>
                <div>
                    <button onClick={() => setIsCreatingAccount(true)}>Create Account</button>
                    <button onClick={() => signIn()}>Sign In</button>
                </div>
            </div>
        </div>
    );
}