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
const blogsRepository_1 = require("../blogsRepository");
const getBlogsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blogsRepository_1.blogsRepository.getAll();
    // const byId = blogId ? { blogId: new ObjectId(blogId) }
    // return res.status(HTTP_STATUSES.OKK_200).json(blogs)
    // return res.status(HTTP_STATUSES.OKK_200).json({
    //     pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
    //     pageSize: req.query.pageSize !== undefined ? +req.query.pageSize : 10,
    //     sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
    //     sortDirection: req.query.sortDirection ? req.query.sortDirection as SortDirection : 'desc',
    //     searhNameTerm: req.query.searchNameTerm ? req.query.searchNameTerm : null
    // })
});
exports.getBlogsController = getBlogsController;
