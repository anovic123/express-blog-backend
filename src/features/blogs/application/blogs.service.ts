import "reflect-metadata"
import { inject, injectable } from "inversify";

import {BlogsRepository} from "../infra/blogs.repository";

import {BlogInputModel, BlogPostInputModel} from "../dto/input";
import {BlogPostViewModel, BlogViewModel} from "../dto/output";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository) {}

    public async createBlog(blog: BlogInputModel): Promise<BlogViewModel | null> {
        return await this.blogsRepository.create(blog)
    }
    public async createPostBlog(blogId: BlogViewModel['id'], post: BlogPostInputModel): Promise<BlogPostViewModel | null> {
        return await this.blogsRepository.createPostBlog(blogId, post)
    }
    public async deleteBlog(id: BlogViewModel['id']): Promise<boolean> {
        return await this.blogsRepository.del(id)
    }
    public async updateBlog(blog: BlogInputModel, id: BlogViewModel['id']): Promise<boolean> {
        return await this.blogsRepository.updateBlog(blog, id)
    }
}
