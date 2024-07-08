"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPostController = void 0;
const postsRepository_1 = require("../postsRepository");
const findPostController = (req, res) => {
    const blogById = postsRepository_1.postsRepository.findAndMap(req.params.id);
    return res.status(200).json(blogById);
};
exports.findPostController = findPostController;
