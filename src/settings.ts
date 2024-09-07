import { config } from 'dotenv'
config()

export const SETTINGS = {
    PORT: 3010,
    PATH: {
        AUTH: '/auth',
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        COMMENTS: '/comments',
        SECURITY: '/security',
        TESTING: '/testing',
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://vkanaev220:Q2tgZaS1r9EQIx2i@api-v1.otqbeom.mongodb.net/?retryWrites=true&w=majority&appName=api-v1',
    TOKENS: {
        ACCESS_TOKEN_EXPIRATION: '99m',
        REFRESH_TOKEN_EXPIRATION : '99m'
    }
}
