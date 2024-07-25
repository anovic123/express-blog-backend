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
exports.putPostController = void 0;
const posts_service_1 = require("../domain/posts-service");
const utils_1 = require("../../../utils");
const putPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const putRes = yield posts_service_1.postsService.putPostById(req.body, req.params.id);
    if (!putRes) {
        res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
});
exports.putPostController = putPostController;
