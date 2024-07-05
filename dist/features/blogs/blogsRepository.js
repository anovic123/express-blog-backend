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
            return yield db_1.blogsCollection.findOne({ id: id });
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
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.find().toArray();
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
