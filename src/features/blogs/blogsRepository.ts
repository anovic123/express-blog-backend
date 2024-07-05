import {BlogDbType} from '../../db/blog-db-type'
import {blogsCollection} from '../../db/db'
import {BlogInputModel, BlogViewModel} from '../../input-output-types/blogs-types'

export const blogsRepository = {
   async create(blog: BlogInputModel): Promise<string> {
        const newBlog: BlogDbType = {
            id: new Date().toISOString() + Math.random(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

       await blogsCollection.insertOne(newBlog)
       return newBlog.id
    },
    async find(id: string): Promise<BlogDbType | null> {
        return await blogsCollection.findOne({ id: id });
    },
    async findAndMap(id: string): Promise<BlogViewModel | null> {
        const blog = await this.find(id)! // ! используем этот метод если проверили существование
        if (!blog) {
            return null
        }
        return this.map(blog)
    },
    async getAll(): Promise<BlogDbType[]> {
       return await blogsCollection.find().toArray()
    },
    async del(id: string): Promise<boolean> {
       const result = await blogsCollection.deleteOne({ id: id })
        return result.deletedCount === 1
    },
    async put(blog: BlogInputModel, id: string): Promise<boolean> {
        const userBlog = await this.find(id)
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