"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delBlogController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const delBlogController = (req, res) => {
    const removeRes = blogsRepository_1.blogsRepository.del(req.params.id);
    if (removeRes) {
        res.sendStatus(204);
        return;
    }
    res.sendStatus(404);
};
exports.delBlogController = delBlogController;
