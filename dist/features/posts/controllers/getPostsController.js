"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsController = void 0;
const postsRepository_1 = require("../postsRepository");
const getPostsController = (req, res) => {
    const posts = postsRepository_1.postsRepository.getAll();
    return res.status(200).json(posts);
};
exports.getPostsController = getPostsController;
