"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../../db/db");
exports.blogsRepository = {
    create(blog) {
        const newBlog = {
            id: new Date().toISOString() + Math.random(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        };
        db_1.db.blogs = [...db_1.db.blogs, newBlog];
        return newBlog.id;
    },
    find(id) {
        return db_1.db.blogs.find(b => b.id === id);
    },
    findAndMap(id) {
        const blog = this.find(id); // ! используем этот метод если проверили существование
        return this.map(blog);
    },
    getAll() {
        return db_1.db.blogs;
    },
    del(id) {
        db_1.db.blogs.filter(el => el.id !== id);
    },
    put(blog, id) {
        const userBlog = this.find(id);
        if (userBlog) {
            const updatedBlog = Object.assign(Object.assign({}, userBlog), { name: blog.name, description: blog.description, websiteUrl: blog.websiteUrl });
            console.log(updatedBlog);
            db_1.db.blogs = db_1.db.blogs.map(el => {
                if (el.id === updatedBlog.id) {
                    return updatedBlog;
                }
                return el;
            });
            return true;
        }
        else {
            return false;
        }
    },
    map(blog) {
        const blogForOutput = {
            id: blog.id,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
        };
        return blogForOutput;
    },
};
