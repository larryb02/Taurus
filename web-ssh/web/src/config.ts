export const config =  {
    api: {
        url: "http://localhost:8000/api",
        routes: {
        auth: {
            login: "/auth/account",
            create: "/auth/create"
        },
        ssh: {
            connection: "/ssh/connection"
        }
    }
    }
    
    
}