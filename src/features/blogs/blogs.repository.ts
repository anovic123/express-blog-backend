import { ObjectId, WithId } from "mongodb";

import {blogsCollection, postsCollection} from '../../db/db'

import {BlogDbType} from '../../db/blog-db-type'

import {
    BlogInputModel,
    BlogPostInputModel,
    BlogPostViewModel,
    BlogViewModel,
} from '../../types/blogs-types'

export const blogsRepository = {
    async create(blog: BlogInputModel): Promise<BlogViewModel | null> {
        const newBlog: WithId<BlogDbType> = {
            _id: new ObjectId(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const result = await blogsCollection.insertOne(newBlog)
       
        if (!result.insertedId) {
            return null
        }

        return this.mapBlog(newBlog)
    },
    async findBlog(id: BlogViewModel['id']): Promise<BlogViewModel | null> {
        const res = await blogsCollection.findOne({ _id: new ObjectId(id) });
        if (!res) return null
        return this.mapBlog(res)
    },
    async del(id: BlogViewModel['id']): Promise<boolean> {
        const result = await blogsCollection.deleteOne({ id: id })
        return result.deletedCount === 1
    },
    async updateBlog(blog: BlogInputModel, id: BlogViewModel['id']): Promise<boolean> {
        const userBlog = await this.findBlog(id)
        if (userBlog) {
            const updatedBlog = {
                ...userBlog,
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
            }
            const result = await blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedBlog });
            return result.matchedCount === 1
        } else {
            return false
        }
    },
    async createPostBlog(blogId: BlogViewModel['id'], post: BlogPostInputModel): Promise<BlogPostViewModel | null> {
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
    mapBlog(blog: WithId<BlogDbType>): BlogViewModel {
        return {
            id: new ObjectId(blog._id).toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    },
    async deleteAll(): Promise<boolean> {
        await blogsCollection.deleteMany()

        return true
    }
}