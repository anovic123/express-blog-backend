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
exports.testingRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../../utils");
const blogsRepository_1 = require("../blogs/blogsRepository");
const postsRepository_1 = require("../posts/postsRepository");
const usersRepository_1 = require("../users/usersRepository");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogsRepository_1.blogsRepository.deleteAll();
    yield postsRepository_1.postsRepository.deleteAll();
    yield usersRepository_1.usersRepository.deleteAll();
    res.status(utils_1.HTTP_STATUSES.NO_CONTENT_204).json({});
}));
