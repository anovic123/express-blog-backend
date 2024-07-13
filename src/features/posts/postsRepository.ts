import {blogsCollection, postsCollection} from '../../db/db'
import {PostInputModel, PostViewModel} from '../../input-output-types/posts-types'
import {PostDbType} from '../../db/post-db-type'
import {blogsRepository} from '../blogs/blogsRepository'
import {ObjectId} from "mongodb";

export const postsRepository = {
    async create(post: PostInputModel) {
        const blogName = await blogsRepository.find(post.blogId)
        if (!blogName) return null
        const newPost: PostDbType = {
            id: new Date().toISOString() + Math.random(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blogName.name,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        await postsCollection.insertOne(newPost)
        return newPost.id
    },
    async find(id: string): Promise<PostDbType | null> {
        const res =  await postsCollection.findOne({ id: id })
        return res
    },
    async findAndMap(id: string): Promise<PostViewModel | null> {
        const post = await this.find(id)! // ! используем этот метод если проверили существование
        if (!post) {
            return null
        }
        return this.map(post)
    },
    async getAll(query: any , blogId: string){
        const byId = blogId ? { blogId: new ObjectId(blogId) } : {}
        const search = query.searchNameTerm ? { title: { $regex: query.searchNameTerm, $options: "i" } } : {} // new RegExp (query.searchNameTerm, 'i')

        const filter: any = {
            ...byId,
            // _id: { $in: [ new ObjectId() ] },
            ...search
        }

        try {
            const items: any = await postsCollection.find(filter).skip((query.pageNumber - 1) * query.pageSize).limit(query.pageSize).toArray()

            const totalCount = await postsCollection.countDocuments(filter)

            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount,
                items: items.map((i: any) => this.map(i))
            }
        } catch (error) {
            console.log(error)
            return []
        }
    },
    async del(id: string) {
        await postsCollection.deleteOne({ id: id })
    },
    async put(post: PostInputModel, id: string) {

        const blog = await blogsRepository.find(post.blogId)

        if (!blog) {
            return null
        }

        const result = await postsCollection.updateOne(
            { id: id },
            {
                $set: {
                    ...post,
                    blogName: blog.name
                }
            }
        );

        return result.matchedCount === 1
    },
    map(post: PostDbType) {
        const postForOutput: PostViewModel = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
        return postForOutput
    },
    async deleteAll(): Promise<boolean> {
        await postsCollection.deleteMany()

        return true
    }
}