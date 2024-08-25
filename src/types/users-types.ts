export type AuthInputModel = {
    loginOrEmail: string
    password: string
}

export type UserInputModel = {
    login: string
    password: string
    email: string
}

export type UserOutputType = {
    id: string
    login: string
    email: string
    createdAt: Date
}