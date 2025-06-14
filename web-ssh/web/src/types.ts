// For types that will be used across application
export interface Connection {
    label: string;
    hostname: string;
    user: string;
    // pass: string;
}

export interface User {
    userId: number;
    email: string;
    username: string;
}