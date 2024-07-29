import {blogsRepository} from '../blogs/blogsRepository'

import {PostDbType} from '../../db/post-db-type'
import {commentsCollection, postsCollection} from '../../db/db'
import {CommentDBType} from "../../db/comment-db-type";

import { PostInputModel } from '../../types/posts-types'
import {CommentViewModel} from "../../types/comment-types";

export const postsRepository = {
    async createPost(post: PostDbType) {
        await postsCollection.insertOne(post)
        return post.id
    },
    async createPostComment(comment: CommentDBType): Promise<CommentViewModel> {
        await commentsCollection.insertOne(comment)
        return comment
    },
    async find(id: string): Promise<PostDbType | null> {
        const res =  await postsCollection.findOne({ $id: id })
        return res
    },
    async del(id: string): Promise<boolean> {
        await postsCollection.deleteOne({ id: id })

        return true
    },
    async put(post: PostInputModel, id: string): Promise<boolean> {

        const blog = await blogsRepository.findBlog(post.blogId)

        if (!blog) {
            return false
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
    async deleteAll(): Promise<boolean> {
        await postsCollection.deleteMany()

        return true
    }
}