"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../../utils");
const blogs_repository_1 = require("../blogs/blogs.repository");
const posts_repository_1 = require("../posts/posts.repository");
const users_repository_1 = require("../users/users.repository");
const comments_repository_1 = require("../comments/comments.repository");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogs_repository_1.blogsRepository.deleteAll();
    yield posts_repository_1.postsRepository.deleteAll();
    yield users_repository_1.usersRepository.deleteAll();
    yield comments_repository_1.commentsRepository.deleteAll();
    res.status(utils_1.HTTP_STATUSES.NO_CONTENT_204).json({});
}));
