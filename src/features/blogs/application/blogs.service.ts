import {BlogInputModel, BlogPostInputModel, BlogPostViewModel, BlogViewModel} from "../../../types/blogs-types";

import {blogsRepository} from "../infra/blogs.repository";

export const blogsService = {
    async createBlog(blog: BlogInputModel): Promise<BlogViewModel | null> {
        return await blogsRepository.create(blog)
    },
    async createPostBlog(blogId: BlogViewModel['id'], post: BlogPostInputModel): Promise<BlogPostViewModel | null> {
        return await blogsRepository.createPostBlog(blogId, post)
    },
    async deleteBlog(id: BlogViewModel['id']): Promise<boolean> {
        return await blogsRepository.del(id)
    },
    async updateBlog(blog: BlogInputModel, id: BlogViewModel['id']): Promise<boolean> {
        return await blogsRepository.updateBlog(blog, id)
    }
}