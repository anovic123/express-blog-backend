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
exports.findPostController = void 0;
const postsRepository_1 = require("../postsRepository");
const utils_1 = require("../../../utils");
const findPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogById = yield postsRepository_1.postsRepository.findAndMap(req.params.id);
    if (!blogById) {
        res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    else {
        res.sendStatus(utils_1.HTTP_STATUSES.OKK_200);
        return;
    }
});
exports.findPostController = findPostController;
