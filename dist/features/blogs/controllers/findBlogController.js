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
exports.findBlogController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const utils_1 = require("../../../utils");
const findBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogById = yield blogsRepository_1.blogsRepository.find(req.params.id);
    if (!blogById) {
        res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    return res.json(blogById);
});
exports.findBlogController = findBlogController;
