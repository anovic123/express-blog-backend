import { ObjectId } from "mongodb";

import {blogsCollection, postsCollection} from '../../db/db'

import {BlogDbType} from '../../db/blog-db-type'

import {
    BlogInputModel,
    BlogPostInputModel,
    BlogPostViewModel,
    BlogViewModel
} from '../../input-output-types/blogs-types'

export const blogsRepository = {
    async create(blog: BlogInputModel): Promise<string> {
        const newBlog: BlogDbType = {
            id: new ObjectId().toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsCollection.insertOne(newBlog)
        return newBlog.id
    },
    async findBlog(id: string): Promise<BlogViewModel | null> {
        const res = await blogsCollection.findOne({ id: id });
        if (!res) return null
        return this.map(res)
    },
    async del(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({ id: id })
        return result.deletedCount === 1
    },
    async updateBlog(blog: BlogInputModel, id: string): Promise<boolean> {
        const userBlog = await this.findBlog(id)
        if (userBlog) {
            const updatedBlog = {
                ...userBlog,
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
            }
            const result = await blogsCollection.updateOne({ id: id }, { $set: updatedBlog });
            return result.matchedCount === 1
        } else {
            return false
        }
    },
    async createPostBlog(blogId: BlogViewModel['id'], post: BlogPostInputModel) {
        const blog = await this.findBlog(blogId)
        if (!blog) {
            return null
        }
        const newPost: any = {
            id: new ObjectId().toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        await postsCollection.insertOne(newPost)
        return this.mapPostBlog(newPost)
    },
    mapPostBlog(post: BlogPostViewModel): BlogPostViewModel {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }
    },
    map(blog: BlogDbType) {
        const blogForOutput: BlogViewModel = {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
        return blogForOutput
    },
    async deleteAll(): Promise<boolean> {
        await blogsCollection.deleteMany()

        return true
    }
}