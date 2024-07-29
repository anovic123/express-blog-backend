import {ObjectId} from "mongodb";

import {commentsCollection, postsCollection} from "../../db/db";
import {PostDbType} from "../../db/post-db-type";

import {PostViewModel} from "../../input-output-types/posts-types";

import {getAllPostsHelper, GetAllPostsHelperResult} from "./helper";

import {CommentDBType} from "../../db/comment-db-type";
import {BlogDbType} from "../../db/blog-db-type";

export const postsQueryRepository = {
    async getMappedPostById(id: PostDbType['id']): Promise<PostViewModel | null> {
        return await this.findAndMap(id)
    },
    async getPostsCommentsLength(id: string): Promise<number> {
        const commentsRes = await commentsCollection.find({ id: new ObjectId(id).toString() }).toArray()

        return commentsRes.length
    },
    async getAllPosts(query: GetAllPostsHelperResult, blogId: BlogDbType['id']) {
        const sanitizedQuery = getAllPostsHelper(query)

        const byId = blogId ? { blogId: new ObjectId(blogId) } : {}
        const search = sanitizedQuery.searchNameTerm ? { title: { $regex: sanitizedQuery.searchNameTerm, $options: "i" } } : {} // new RegExp (query.searchNameTerm, 'i')

        const filter: any = {
            ...byId,
            ...search
        }

        try {
            const items: any = await postsCollection.find(filter).sort(sanitizedQuery.sortBy, sanitizedQuery.sortDirection).skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize).limit(sanitizedQuery.pageSize).toArray()

            const totalCount = await postsCollection.countDocuments(filter)

            return {
                pagesCount: Math.ceil(totalCount / (query.pageSize ?? 10)),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount,
                items: items.map((i: any) => this.mapPostOutput(i))
            }
        } catch (error) {
            console.log(error)
            return []
        }
    },
    async getPostsComments (query: GetAllPostsHelperResult, postId: string) {
        const sanitizedQuery = getAllPostsHelper(query)

        const byId = postId ? { id: postId} : {}
        const search = sanitizedQuery.searchNameTerm ? { title: { $regex: sanitizedQuery.searchNameTerm, $options: "i" } } : {}

        const filter: any = {
            ...byId,
            ...search
        }

        try {
            const items: any = await commentsCollection.find(filter).sort(sanitizedQuery.sortBy, sanitizedQuery.sortDirection).skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize).limit(sanitizedQuery.pageSize).toArray()

            const totalCount = await commentsCollection.countDocuments(filter)

            return {
                pagesCount: Math.ceil(totalCount / (query.pageSize ?? 10)),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount,
                items: items.map((i: any) => this.mapPostCommentsOutput(i))
            }
        } catch(error) {
            console.log(error)
            return []
        }
    },
    async findAndMap(id: string): Promise<PostViewModel | null> {
        const post = await this.find(id)! // ! используем этот метод если проверили существование
        console.log(post)
        if (!post) {
            return null
        }
        return this.mapPostOutput(post)
    },
    async find(id: string): Promise<PostDbType | null> {
        const res =  await postsCollection.findOne({ id: id })
        return res
    },
    mapPostOutput(post: PostDbType) {
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
    mapPostCommentsOutput(comment: CommentDBType) {
        const commentForOutput = {
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }
        return commentForOutput
    }
}