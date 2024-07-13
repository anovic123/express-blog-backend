"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const createBlogController_1 = require("./controllers/createBlogController");
const getBlogsController_1 = require("./controllers/getBlogsController");
const findBlogController_1 = require("./controllers/findBlogController");
const delBlogController_1 = require("./controllers/delBlogController");
const putBlogController_1 = require("./controllers/putBlogController");
const blogValidators_1 = require("./middlewares/blogValidators");
const admin_middleware_1 = require("../../global-middlewares/admin-middleware");
const createBlogPostController_1 = require("./controllers/createBlogPostController");
const getBlogPostsController_1 = require("./controllers/getBlogPostsController");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.post('/', ...blogValidators_1.blogValidators, createBlogController_1.createBlogController);
exports.blogsRouter.get('/', getBlogsController_1.getBlogsController);
exports.blogsRouter.get('/:id', blogValidators_1.findBlogValidator, findBlogController_1.findBlogController);
exports.blogsRouter.delete('/:id', admin_middleware_1.adminMiddleware, delBlogController_1.delBlogController);
exports.blogsRouter.put('/:id', blogValidators_1.findBlogValidator, ...blogValidators_1.blogValidators, putBlogController_1.putBlogController);
exports.blogsRouter.post('/:blogId/posts', ...blogValidators_1.createBlogPostValidator, createBlogPostController_1.createBlogPostController);
exports.blogsRouter.get('/:blogId/posts', blogValidators_1.findBlogPostValidator, getBlogPostsController_1.getBlogPostsController);
