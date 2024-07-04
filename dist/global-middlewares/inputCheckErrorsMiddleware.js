"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputCheckErrorsMiddleware = void 0;
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
const inputCheckErrorsMiddleware = (req, res, next) => {
    const e = (0, express_validator_1.validationResult)(req);
    if (!e.isEmpty()) {
        const eArray = e.array({ onlyFirstError: true });
        // console.log(eArray)
        res
            .status(utils_1.HTTP_STATUSES.BAD_REQUEST_400)
            .json({
            errorsMessages: eArray.map(x => ({ field: x.path, message: x.msg }))
        });
        return;
    }
    next();
};
exports.inputCheckErrorsMiddleware = inputCheckErrorsMiddleware;
