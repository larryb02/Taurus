export const config = {
    api: {
        url: "http://localhost:8000/api",
        routes: {
            auth: {
                login: "/auth/login",
                logoff:"/auth/logoff",
                user: "/auth/user"
            },
            ssh: {
                connection: "/ssh/connection"
            }
        }
    }


}