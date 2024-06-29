"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delBlogController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const delBlogController = (req, res) => {
    const blogId = req.params.id;
    const blog = blogsRepository_1.blogsRepository.find(blogId);
    if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
    }
    blogsRepository_1.blogsRepository.del(req.params.id);
    return res.sendStatus(204);
};
exports.delBlogController = delBlogController;
