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
exports.blogsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../db/db");
exports.blogsRepository = {
    create(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                id: new mongodb_1.ObjectId().toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            yield db_1.blogsCollection.insertOne(newBlog);
            return newBlog.id;
        });
    },
    findBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.blogsCollection.findOne({ id: id });
            if (!res)
                return null;
            return this.map(res);
        });
    },
    del(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    updateBlog(blog, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userBlog = yield this.findBlog(id);
            if (userBlog) {
                const updatedBlog = Object.assign(Object.assign({}, userBlog), { name: blog.name, description: blog.description, websiteUrl: blog.websiteUrl });
                const result = yield db_1.blogsCollection.updateOne({ id: id }, { $set: updatedBlog });
                return result.matchedCount === 1;
            }
            else {
                return false;
            }
        });
    },
    createPostBlog(blogId, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.findBlog(blogId);
            if (!blog) {
                return null;
            }
            const newPost = {
                id: new mongodb_1.ObjectId().toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            };
            yield db_1.postsCollection.insertOne(newPost);
            return this.mapPostBlog(newPost);
        });
    },
    mapPostBlog(post) {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        };
    },
    map(blog) {
        const blogForOutput = {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        };
        return blogForOutput;
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.blogsCollection.deleteMany();
            return true;
        });
    }
};
