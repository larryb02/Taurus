import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { config } from "@taurus/config";


type ProtectedRouteProps = {
    children: React.ReactNode;
}


const fetchUser = async () => {
    const res = await fetch(`${config.api.url}${config.api.routes.auth.user}`, {
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error(`No user signed in.`);
    }
    return res.json();
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
    const { isLoading, data, isError } = useQuery({ queryKey: ['user'], queryFn: fetchUser, retry: false });

    if (isLoading) {
        console.log("Loading...")
        return;
    }
    if (isError) {
        console.warn("Error occurred");
        return <Navigate to="/login" />
    }
    const currentUser = { // guess i dont even need to do this can just set it to data
        userId: data['result']['user_id'],
        email: data['result']['email_address'],
        username: data['result']['username']
    };
    if (!currentUser) {
        console.warn("No user signed in")
        return <Navigate to="/login" />
    }

    return children;
}

export default ProtectedRoute;