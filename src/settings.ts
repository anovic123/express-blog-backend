import { config } from 'dotenv'
config()

export const SETTINGS = {
    PORT: 3000,
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
    MONGO_URI: process.env.MONGO_URI
}
