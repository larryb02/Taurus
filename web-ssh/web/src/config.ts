export const config = {
    api: {
        url: "http://localhost:8000/api",
        routes: {
            auth: {
                login: "/auth/login",
                user: "/auth/user"
            },
            ssh: {
                connection: "/ssh/connection"
            }
        }
    }


}