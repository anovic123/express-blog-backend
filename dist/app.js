"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const settings_1 = require("./settings");
const blogs_1 = require("./features/blogs");
const testing_1 = require("./features/testing");
const posts_1 = require("./features/posts");
const auth_1 = require("./features/auth");
const users_1 = require("./features/users");
const comments_1 = require("./features/comments");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.get('/', (req, res) => {
    res.status(200).json({ version: '1.0' });
});
exports.app.use(settings_1.SETTINGS.PATH.AUTH, auth_1.authRouter);
exports.app.use(settings_1.SETTINGS.PATH.BLOGS, blogs_1.blogsRouter);
exports.app.use(settings_1.SETTINGS.PATH.POSTS, posts_1.postsRouter);
exports.app.use(settings_1.SETTINGS.PATH.USERS, users_1.usersRouter);
exports.app.use(settings_1.SETTINGS.PATH.COMMENTS, comments_1.commentsRouter);
exports.app.use(settings_1.SETTINGS.PATH.TESTING, testing_1.testingRouter);
