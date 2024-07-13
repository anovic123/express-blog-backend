import {BlogDbType} from '../../db/blog-db-type'
import {blogsCollection} from '../../db/db'
import {
    BlogInputModel,
    BlogPostInputModel,
    BlogPostViewModel,
    BlogViewModel
} from '../../input-output-types/blogs-types'

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
        const blog = await this.find(id)! // ! используем этот метод если проверили существование
        if (!blog) {
            return null
        }
        return this.map(blog)
    },
    async getAll(): Promise<BlogViewModel[]> {
       const res = await blogsCollection.find().toArray()
        return res.map(blog => this.map(blog));
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
    async createPostBlog(id: BlogViewModel['id'], post: BlogPostInputModel): Promise<BlogPostViewModel | null> {
       const blog = await this.find(id)
        if (!blog) {
            return null
        }
       const newPost = {
           id: new Date().toISOString() + Math.random(),
           title: post.title,
           shortDescription: post.shortDescription,
           content: post.content,
           blogId: blog.id,
           blogName: blog.name,
           createdAt: new Date().toISOString()
       }

        await blogsCollection.updateOne(
            { id: blog.id },
            { $push: { posts: newPost } }
        );

        return newPost
    },
    // async findPostBlog(blogId: BlogViewModel['id']): Promise<BlogPostViewModel | null> {
    //    const blog = await blogsRepository.find({ id: blogId })
    //     if (!blog) {
    //         return null
    //     }
    //
    //     const post = blog.posts
    //     //    const res = await blogsCollection.findOne({ id: id });
    //     // if (!res) return null
    //     // return this.map(res)
    // }
    async mapPostBlog(post: BlogPostViewModel) {
       const blogForOutput: BlogPostInputModel = {
           title: post.title,
           shortDescription: post.shortDescription,
           content: post.shortDescription
       }

       return blogForOutput
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
