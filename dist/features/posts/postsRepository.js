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
const mongodb_1 = require("mongodb");
exports.postsRepository = {
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.postsCollection.insertOne(post);
                return result.insertedId.toString();
            }
            catch (error) {
                console.error("Error creating post:", error);
                throw new Error("Failed to create post");
            }
        });
    },
    createPostComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.commentsCollection.insertOne(comment);
                return comment;
            }
            catch (error) {
                console.error("Error creating post comment:", error);
                throw new Error("Failed to create post comment");
            }
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongodb_1.ObjectId.isValid(id)) {
                    return null;
                }
                const postId = new mongodb_1.ObjectId(id);
                const post = yield db_1.postsCollection.findOne({ _id: postId });
                return post || null;
            }
            catch (error) {
                console.error("Error finding post:", error);
                return null;
            }
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongodb_1.ObjectId.isValid(id)) {
                    return false;
                }
                const postId = new mongodb_1.ObjectId(id);
                const result = yield db_1.postsCollection.deleteOne({ _id: postId });
                return result.deletedCount === 1;
            }
            catch (error) {
                console.error("Error deleting post:", error);
                return false;
            }
        });
    },
    updatePost(post, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield blogsRepository_1.blogsRepository.findBlog(post.blogId);
                if (!blog) {
                    return false;
                }
                if (!mongodb_1.ObjectId.isValid(id)) {
                    return false;
                }
                const postId = new mongodb_1.ObjectId(id);
                const result = yield db_1.postsCollection.updateOne({ _id: postId }, {
                    $set: Object.assign(Object.assign({}, post), { blogName: blog.name }),
                });
                return result.matchedCount === 1;
            }
            catch (error) {
                console.error("Error updating post:", error);
                return false;
            }
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.postsCollection.deleteMany();
                return true;
            }
            catch (error) {
                console.error("Error deleting all posts:", error);
                return false;
            }
        });
    },
};
