"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogsController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const getBlogsController = (req, res) => {
    const blogs = blogsRepository_1.blogsRepository.getAll();
    return res.status(200).json(blogs);
};
exports.getBlogsController = getBlogsController;
