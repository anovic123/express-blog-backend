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
            yield db_1.blogsCollection.updateOne({ id: blog.id }, { $push: { posts: newPost } });
            return this.mapPostBlog(newPost);
        });
    },
    findBlogPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogsCollection.findOne({ id });
            return blog;
        });
    },
    getBlogPosts(query, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(blogId);
            const filter = {
                id: blogId
            };
            try {
                const totalCountResult = yield db_1.blogsCollection.aggregate([
                    { $match: filter },
                    { $unwind: '$posts' },
                    { $count: 'totalCount' }
                ]).toArray();
                const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
                const result = yield db_1.blogsCollection.aggregate([
                    { $match: filter },
                    { $unwind: '$posts' },
                    { $sort: { [`posts.${query.sortBy}`]: query.sortDirection === 'asc' ? 1 : -1 } },
                    { $skip: (query.pageNumber - 1) * query.pageSize },
                    { $limit: query.pageSize },
                    { $group: {
                            _id: '$_id',
                            posts: { $push: '$posts' }
                        } },
                    { $project: {
                            _id: 0,
                            posts: 1
                        } }
                ]).toArray();
                if (!result || result.length === 0) {
                    return {
                        pagesCount: Math.ceil(totalCount / query.pageSize),
                        page: query.pageNumber,
                        pageSize: query.pageSize,
                        totalCount,
                        items: 0
                    };
                }
                const { posts } = result[0];
                return {
                    pagesCount: Math.ceil(totalCount / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount,
                    items: posts
                };
            }
            catch (error) {
                console.error(error);
                return null;
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
