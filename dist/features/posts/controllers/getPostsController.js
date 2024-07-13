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
exports.getPostsController = void 0;
const postsRepository_1 = require("../postsRepository");
const utils_1 = require("../../../utils");
const helper_1 = require("../helper");
const getPostsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sanitizedQuery = (0, helper_1.helper)(req.query);
    const posts = yield postsRepository_1.postsRepository.getAll(sanitizedQuery, req.params.id);
    return res.status(utils_1.HTTP_STATUSES.OKK_200).json(posts);
});
exports.getPostsController = getPostsController;
