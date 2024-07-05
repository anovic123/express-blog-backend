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
exports.postValidators = exports.putValidators = exports.findPostValidator = exports.blogIdValidator = exports.contentValidator = exports.shortDescriptionValidator = exports.titleValidator = void 0;
const express_validator_1 = require("express-validator");
const inputCheckErrorsMiddleware_1 = require("../../../global-middlewares/inputCheckErrorsMiddleware");
const blogsRepository_1 = require("../../blogs/blogsRepository");
const postsRepository_1 = require("../postsRepository");
const admin_middleware_1 = require("../../../global-middlewares/admin-middleware");
// title: string // max 30
// shortDescription: string // max 100
// content: string // max 1000
// blogId: string // valid
exports.titleValidator = (0, express_validator_1.body)('title').trim().isString().isLength({ min: 3, max: 30 }).withMessage('title');
exports.shortDescriptionValidator = (0, express_validator_1.body)('shortDescription').isString().isLength({ min: 3, max: 100 }).withMessage('shortDescription');
exports.contentValidator = (0, express_validator_1.body)('content').trim().isString().isLength({ min: 3, max: 1000 }).withMessage('not string')
    .trim().isLength({ min: 1, max: 1000 }).withMessage('more then 1000 or 0');
exports.blogIdValidator = (0, express_validator_1.body)('blogId').isString().withMessage('not string')
    .trim().custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogsRepository_1.blogsRepository.find(blogId);
    return !!blog;
})).withMessage('no blog');
const findPostValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postsRepository_1.postsRepository.find(req.params.id);
    console.log(post);
    if (!post) {
        res
            .status(404)
            .json({});
        return;
    }
    next();
});
exports.findPostValidator = findPostValidator;
exports.putValidators = [
    admin_middleware_1.adminMiddleware, exports.titleValidator, exports.shortDescriptionValidator, exports.contentValidator, exports.blogIdValidator, exports.findPostValidator, inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware
];
exports.postValidators = [
    admin_middleware_1.adminMiddleware,
    exports.titleValidator,
    exports.shortDescriptionValidator,
    exports.contentValidator,
    exports.blogIdValidator,
    inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware,
];
