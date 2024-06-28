"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidators = exports.findBlogValidator = exports.websiteUrlValidator = exports.descriptionValidator = void 0;
const express_validator_1 = require("express-validator");
const inputCheckErrorsMiddleware_1 = require("../../../global-middlewares/inputCheckErrorsMiddleware");
const admin_middleware_1 = require("../../../global-middlewares/admin-middleware");
// name: string // max 15
// description: string // max 500
// websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
// export const nameValidator =
exports.descriptionValidator = (0, express_validator_1.body)('description').isString().withMessage('not string')
    .trim().isLength({ min: 1, max: 500 }).withMessage('more then 500 or 0');
exports.websiteUrlValidator = (0, express_validator_1.body)('websiteUrl').isString().withMessage('not string')
    .trim().isURL().withMessage('not url')
    .isLength({ min: 1, max: 100 }).withMessage('more then 100 or 0');
const findBlogValidator = (req, res, next) => {
    (0, express_validator_1.body)('id').isString().withMessage('not id');
    const errors = (0, express_validator_1.validationResult)(req);
    if (!req.params.id) {
        res.status(404).json({ messages: errors.array() });
        return;
    }
    next();
};
exports.findBlogValidator = findBlogValidator;
exports.blogValidators = [
    admin_middleware_1.adminMiddleware,
    // nameValidator,
    exports.descriptionValidator,
    exports.websiteUrlValidator,
    inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware,
];
