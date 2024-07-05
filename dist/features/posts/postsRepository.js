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
const db_1 = require("../../db/db");
const blogsRepository_1 = require("../blogs/blogsRepository");
exports.postsRepository = {
    create(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogName = yield blogsRepository_1.blogsRepository.find(post.blogId);
            if (!blogName)
                return null;
            const newPost = {
                id: new Date().toISOString() + Math.random(),
                title: post.title,
                content: post.content,
                shortDescription: post.shortDescription,
                blogId: post.blogId,
                blogName: blogName.name,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            yield db_1.postsCollection.insertOne(newPost);
            return newPost.id;
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.postsCollection.findOne({ id: id });
            return res;
        });
    },
    findAndMap(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.find(id); // ! используем этот метод если проверили существование
            if (!post) {
                return null;
            }
            return this.map(post);
        });
    },
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_1.postsCollection.find().toArray();
            return posts.map(post => this.map(post));
        });
    },
    del(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.postsCollection.deleteOne({ id: id });
        });
    },
    put(post, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogsRepository_1.blogsRepository.find(post.blogId);
            if (!blog) {
                return null;
            }
            const result = yield db_1.postsCollection.updateOne({ id: id }, {
                $set: Object.assign(Object.assign({}, post), { blogName: blog.name })
            });
            return result.matchedCount === 1;
        });
    },
    map(post) {
        const postForOutput = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        };
        return postForOutput;
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.postsCollection.deleteMany();
            return true;
        });
    }
};
