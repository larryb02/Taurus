export const config = {
    api: {
        url: "http://localhost:8000/api",
        routes: {
            auth: {
                login: "/auth/login",
                create: "/auth/create",
                user: "/auth/user"
            },
            ssh: {
                connection: "/ssh/connection"
            }
        }
    }


}