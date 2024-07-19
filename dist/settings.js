"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.SETTINGS = {
    PORT: 5000,
    PATH: {
        AUTH: '/',
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        TESTING: '/testing',
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    MONGO_URI: process.env.MONGO_URI
};
