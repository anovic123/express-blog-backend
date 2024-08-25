import {ObjectId, WithId} from "mongodb";

import {getAllPostsHelper, GetAllPostsHelperResult} from "../helper";

import {PostDbType, PostModel} from "../domain/post.entity";

import {CommentDBType, CommentModel} from "../../comments/domain/comment.entity";

import {BlogViewModel} from "../../../types/blogs-types";
import {PostViewModel} from "../../../types/posts-types";

export const postsQueryRepository = {
    async getMappedPostById(id: PostViewModel['id']): Promise<PostViewModel | null> {
        return await this.findPostsAndMap(id)
    },
    async getPostsCommentsLength(id: string): Promise<number> {
        const commentsRes = await CommentModel.find({ _id: new ObjectId(id) }).exec()
        return commentsRes.length
    },
    async getAllPosts(query: GetAllPostsHelperResult, blogId: BlogViewModel['id']) {
        const sanitizedQuery = getAllPostsHelper(query)

        const byId = blogId ? { blogId: new ObjectId(blogId) } : {}
        const search = sanitizedQuery.searchNameTerm ? { title: { $regex: sanitizedQuery.searchNameTerm, $options: "i" } } : {} // new RegExp (query.searchNameTerm, 'i')

        const filter: any = {
            ...byId,
            ...search
        }

        const sortDirection = sanitizedQuery.sortDirection === 'asc' ? 1 : -1

        try {
            const items: any = await PostModel.find(filter).sort(sanitizedQuery.sortBy, { [ sanitizedQuery.sortDirection ]: sortDirection }).skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize).limit(sanitizedQuery.pageSize).exec()

            const totalCount = await PostModel.countDocuments(filter)

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

        const byId = postId ? { postId} : {}
        const search = sanitizedQuery.searchNameTerm ? { title: { $regex: sanitizedQuery.searchNameTerm, $options: "i" } } : {}

        const filter: any = {
            ...byId,
            ...search
        }

        const sortDirection = sanitizedQuery.sortDirection === 'asc' ? 1 : -1

        try {
            const items: any = await CommentModel.find(filter).sort(sanitizedQuery.sortBy, {[ sanitizedQuery.sortDirection ]: sortDirection}).skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize).limit(sanitizedQuery.pageSize).exec()

            const totalCount = await CommentModel.countDocuments(filter)

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
    async findPostsAndMap(id: PostViewModel['id']): Promise<PostViewModel | null> {
        const post = await this.findPost(id)
        if (!post) {
            return null
        }
        return this.mapPostOutput(post)
    },
    async findPost(id: PostViewModel['id']): Promise<WithId<PostDbType> | null> {
        const res = await PostModel.findOne({ _id: new ObjectId(id) })

        if (!res) {
            return null
        }

        return res
    },
    mapPostOutput(post: WithId<PostDbType>) {
        const postForOutput: PostViewModel = {
            id: new ObjectId(post._id).toString(),
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