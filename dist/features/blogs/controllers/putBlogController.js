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
exports.putBlogController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const utils_1 = require("../../../utils");
const putBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateBlog = yield blogsRepository_1.blogsRepository.put(req.body, req.params.id);
    if (!updateBlog) {
        return res.status(utils_1.HTTP_STATUSES.NOT_FOUND_404).json({
            errorsMessages: [
                {
                    message: 'Update blog',
                    field: 'Something went wrong'
                }
            ]
        });
    }
    return res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
});
exports.putBlogController = putBlogController;
