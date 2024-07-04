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
exports.createPostController = void 0;
const postsRepository_1 = require("../postsRepository");
const utils_1 = require("../../../utils");
const createPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPostId = yield postsRepository_1.postsRepository.create(req.body);
    if (!newPostId) {
        res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const newPost = yield postsRepository_1.postsRepository.findAndMap(newPostId);
    if (!newPost) {
        res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    return res
        .status(utils_1.HTTP_STATUSES.CREATED_201)
        .json(newPost);
});
exports.createPostController = createPostController;
