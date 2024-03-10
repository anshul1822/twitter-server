export interface jwtUser {
    id : string
    email : string
}

export interface GraphqlContext {
    user? : jwtUser
}