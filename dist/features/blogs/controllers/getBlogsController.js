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
exports.getBlogsController = void 0;
const blogsQueryRepository_1 = require("../blogsQueryRepository");
const utils_1 = require("../../../utils");
const getBlogsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blogsQueryRepository_1.blogsQueryRepository.getAllBlogs(req.query, req.params.id);
    return res.status(utils_1.HTTP_STATUSES.OKK_200).json(blogs);
});
exports.getBlogsController = getBlogsController;
