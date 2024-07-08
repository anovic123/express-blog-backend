"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putBlogController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const putBlogController = (req, res) => {
    const updateBlog = blogsRepository_1.blogsRepository.put(req.body, req.params.id);
    if (updateBlog) {
        res.sendStatus(204);
        return;
    }
    return res.status(400).json({
        errorsMessages: [
            {
                message: 'Update blog',
                field: 'Something went wrong'
            }
        ]
    });
};
exports.putBlogController = putBlogController;
