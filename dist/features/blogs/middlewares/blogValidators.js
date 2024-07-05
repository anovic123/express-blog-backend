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
exports.blogValidators = exports.findBlogValidator = exports.websiteUrlValidator = exports.descriptionValidator = exports.nameValidator = void 0;
const express_validator_1 = require("express-validator");
const inputCheckErrorsMiddleware_1 = require("../../../global-middlewares/inputCheckErrorsMiddleware");
const blogsRepository_1 = require("../blogsRepository");
const admin_middleware_1 = require("../../../global-middlewares/admin-middleware");
const utils_1 = require("../../../utils");
// name: string // max 15
// description: string // max 500
// websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
exports.nameValidator = (0, express_validator_1.body)('name').trim().isLength({ min: 3, max: 15 }).isString().withMessage('name');
exports.descriptionValidator = (0, express_validator_1.body)('description').isString().withMessage('not string')
    .trim().isLength({ min: 1, max: 500 }).withMessage('more then 500 or 0');
exports.websiteUrlValidator = (0, express_validator_1.body)('websiteUrl').isString().withMessage('not string')
    .trim().isURL().withMessage('not url')
    .isLength({ min: 1, max: 100 }).withMessage('more then 100 or 0');
const findBlogValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, express_validator_1.body)('id').isString().withMessage('not id');
    const errors = (0, express_validator_1.validationResult)(req);
    const findExistedBlog = yield blogsRepository_1.blogsRepository.find(req.params.id);
    if (!req.params.id || !findExistedBlog) {
        res.status(utils_1.HTTP_STATUSES.NOT_FOUND_404).json({ messages: errors.array() });
        return;
    }
    next();
});
exports.findBlogValidator = findBlogValidator;
exports.blogValidators = [
    admin_middleware_1.adminMiddleware,
    exports.nameValidator,
    exports.descriptionValidator,
    exports.websiteUrlValidator,
    inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware,
];
