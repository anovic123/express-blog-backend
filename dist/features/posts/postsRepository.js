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
exports.postsRepository = void 0;
const blogsRepository_1 = require("../blogs/blogsRepository");
const db_1 = require("../../db/db");
exports.postsRepository = {
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.postsCollection.insertOne(post);
            return post.id;
        });
    },
    createPostComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.commentsCollection.insertOne(comment);
            return comment;
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.postsCollection.findOne({ $id: id });
            return res;
        });
    },
    del(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.postsCollection.deleteOne({ id: id });
            return true;
        });
    },
    put(post, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogsRepository_1.blogsRepository.find(post.blogId);
            if (!blog) {
                return false;
            }
            const result = yield db_1.postsCollection.updateOne({ id: id }, {
                $set: Object.assign(Object.assign({}, post), { blogName: blog.name })
            });
            return result.matchedCount === 1;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.postsCollection.deleteMany();
            return true;
        });
    }
};
