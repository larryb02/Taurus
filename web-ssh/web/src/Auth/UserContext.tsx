/*
    Information about the currently signed in user, this is strictly for rendering user metadata
 */

import { createContext, useContext, useState, type ReactNode } from "react";
import { type User } from '@taurus/types';


type Props = {
    children: ReactNode;
};

interface UserContextInterface {
    isSignedIn: boolean;
    setIsSignedIn: (value: boolean) => void;
    currentUser: User | null;
    setCurrentUser: (value: User) => void;
}
const UserContext = createContext<UserContextInterface | null>(null);

export const UserContextProvider: React.FC<Props> = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    return (
        <UserContext value={{ isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
            {children}
        </UserContext>)
}

export const useUserContext = () => {
    const ctx = useContext(UserContext);

    if (!ctx) {
        throw new Error("UserContext must be used within a UserContext Provider");
    }

    return ctx;
}