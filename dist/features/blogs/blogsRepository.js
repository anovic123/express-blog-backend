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
const db_1 = require("../../db/db");
const mongodb_1 = require("mongodb");
exports.blogsRepository = {
    create(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                id: new Date().toISOString() + Math.random(),
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
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.blogsCollection.findOne({ id: id });
            if (!res)
                return null;
            return this.map(res);
        });
    },
    findAndMap(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.find(id); // ! используем этот метод если проверили существование
            if (!blog) {
                return null;
            }
            return this.map(blog);
        });
    },
    getAll(query, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const byId = blogId ? { blogId: new mongodb_1.ObjectId(blogId) } : {};
            const search = query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: "i" } } : {};
            const filter = Object.assign(Object.assign({}, byId), search);
            try {
                const items = yield db_1.blogsCollection.find(filter).sort(query.sortBy, query.sortDirection).skip((query.pageNumber - 1) * query.pageSize).limit(query.pageSize).toArray();
                const totalCount = yield db_1.blogsCollection.countDocuments(filter);
                return {
                    pagesCount: Math.ceil(totalCount / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount,
                    items: items.map((b) => this.map(b))
                };
            }
            catch (error) {
                console.log(error);
                return [];
            }
        });
    },
    del(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    put(blog, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userBlog = yield this.find(id);
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
    createPostBlog(id, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.find(id);
            console.log(blog);
            if (!blog) {
                return null;
            }
            const newPost = {
                id: new Date().toISOString() + Math.random(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            };
            // await blogsCollection.updateOne(
            //     { id: blog.id },
            //     { $push: { posts: newPost } }
            // );
            yield db_1.postsCollection.insertOne(newPost);
            return newPost;
        });
    },
    getBlogPosts(query, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(blogId);
            const byId = blogId ? { blogId } : {};
            const search = query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: "i" } } : {};
            const filter = Object.assign(Object.assign({}, byId), search);
            try {
                const items = yield db_1.postsCollection.find(filter).sort(query.sortBy, query.sortDirection).skip((query.pageNumber - 1) * query.pageSize).limit(query.pageSize).toArray();
                const totalCount = yield db_1.postsCollection.countDocuments(filter);
                return {
                    pagesCount: Math.ceil(totalCount / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount,
                    items: items.map((b) => this.map(b))
                };
            }
            catch (error) {
                console.log(error);
                return [];
            }
        });
    },
    mapPostBlog(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogForOutput = {
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.shortDescription
            };
            return blogForOutput;
        });
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
