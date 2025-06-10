import { useState } from "react";
import { updateField } from "../utils";
import { config } from "../config";

interface UserForm {
    username: string;
    // email: string;
    password: string;
}

interface NewUserForm {
    username: string;
    // email: string;
    password: string;
    confirmPassword: string;
}

export default function Login() {
    const [userData, setUserData] = useState<UserForm>({
        username: "",
        password: ""
    });

    const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);

    const [newUserData, setNewUserData] = useState<NewUserForm>({
        username: "",
        password: "",
        confirmPassword: ""
    });

    const signIn = async () => {
        try {
            const res = await fetch(`${config.api.url}${config.api.routes.auth.login}`,
                {
                    method: "POST",
                    body: JSON.stringify(userData),
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
                Route: ${config.api.routes.auth.login}
                Error: ${error}}`
            );
        }
    }

    const createAccount = async () => {
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
    <div>
        <div>
            <label>Username</label>
            <input type="text" onChange={
                (e) => updateField(userData, setUserData, "username", e.target.value)
            }>
            </input>
        </div>
        <div>
            <label>Password</label>
            <input type="password" onChange={
                (e) => updateField(userData, setUserData, "password", e.target.value)
            }>
            </input>
        </div>
        <div>
            <button onClick={() => setIsCreatingAccount(true)}>Create Account</button>
            <button onClick={() => signIn()}>Sign In</button>
        </div>
    </div>
);
}