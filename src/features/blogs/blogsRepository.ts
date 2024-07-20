import {BlogDbType} from '../../db/blog-db-type'
import {blogsCollection, postsCollection} from '../../db/db'
import {
    BlogInputModel,
    BlogPostInputModel,
    BlogPostViewModel,
    BlogViewModel
} from '../../input-output-types/blogs-types'
import {ObjectId} from "mongodb";

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
    async find(id: string): Promise<BlogViewModel | null> {
        const res = await blogsCollection.findOne({ id: id });
        if (!res) return null
        return this.map(res)
    },
    async findAndMap(id: string): Promise<BlogViewModel | null> {
        const blog = await this.find(id)!
        if (!blog) {
            return null
        }
        return this.map(blog)
    },
    async getAll(query: any, blogId: string) {
        const byId = blogId ? { blogId: new ObjectId(blogId) } : {}
        const search = query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: "i" } } : {}

        const filter: any = {
            ...byId,
            ...search,
        }

        try {
            const items: any = await blogsCollection.find(filter).sort(query.sortBy, query.sortDirection).skip((query.pageNumber - 1) * query.pageSize).limit(query.pageSize).toArray()

            const totalCount = await blogsCollection.countDocuments(filter)

            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount,
                items: items.map((b: any) => this.map(b))
            }
        } catch (error) {
            console.log(error)
            return []
        }
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
    async createPostBlog(blogId: BlogViewModel['id'], post: BlogPostInputModel) {
       const blog = await this.find(blogId)
        if (!blog) {
            return null
        }
       const newPost: any = {
           id: new Date().toISOString() + Math.random(),
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
    async getBlogPosts(query: any, blogId: string): Promise<{
       pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: BlogPostViewModel[]
    } | []> {

        const byId = blogId ? { blogId } : {}
        const search = query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: "i" } } : {}

        const filter: any = {
            ...byId,
            ...search,
        }

        try {
            const items: any = await postsCollection.find(filter).sort(query.sortBy, query.sortDirection).skip((query.pageNumber - 1) * query.pageSize).limit(query.pageSize).toArray()

            const totalCount = await postsCollection.countDocuments(filter)

            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount,
                items: items.map((b: any) => this.mapPostBlog(b))
            }
        } catch (error) {
            console.log(error)
            return []
        }
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
