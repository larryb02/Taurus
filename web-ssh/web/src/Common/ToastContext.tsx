// import Snackbar from '@mui/material/Snackbar';
import { useState, useContext, createContext, type ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';

type Props = {
    children: ReactNode;
}
type ToastContextProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToastContext = createContext<ToastContextProps | null>(null);


export const ToastContextProvider: React.FC<Props> = ({ children }) => {
    const [open, setOpen] = useState(false); // for succesful account creation, name appropriately
    const handleClose = () => {
        setOpen(false);
    };
    return <ToastContext value={{ open, setOpen }}>
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            message="Successfully created account"
        />
        {children}
    </ToastContext>;
}

export const useToastContext = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("ToastContext must be used within a ToastContextProvider");
    }
    return ctx;
}