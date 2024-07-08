"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBlogController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const findBlogController = (req, res) => {
    const blogById = blogsRepository_1.blogsRepository.find(req.params.id);
    console.log(blogById);
    if (!blogById) {
        res.sendStatus(404);
        return;
    }
    return res.json(blogById);
};
exports.findBlogController = findBlogController;
