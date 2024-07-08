"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputCheckErrorsMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputCheckErrorsMiddleware = (req, res, next) => {
    const e = (0, express_validator_1.validationResult)(req);
    if (!e.isEmpty()) {
        const eArray = e.array({ onlyFirstError: true });
        // console.log(eArray)
        res
            .status(400)
            .json({
            errorsMessages: eArray.map(x => ({ field: x.path, message: x.msg }))
        });
        return;
    }
    next();
};
exports.inputCheckErrorsMiddleware = inputCheckErrorsMiddleware;
