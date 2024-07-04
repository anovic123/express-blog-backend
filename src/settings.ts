import {config} from 'dotenv'
config()

export const SETTINGS = {
    PORT: 5000,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing',
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    MONGO_URI: process.env.MONGO_URI
}

