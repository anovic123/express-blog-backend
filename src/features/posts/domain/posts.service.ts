import {ObjectId, WithId} from "mongodb";

import {blogsRepository} from "../../blogs/blogs.repository";
import {postsRepository} from "../posts.repository";

import {commentsQueryRepository} from "../../comments/comments-query.repository";

import {PostDbType} from "../../../db/post-db-type";
import {UserAccountDBType} from "../../../db/user-db-type";

import {PostInputModel, PostViewModel} from "../../../types/posts-types";

import {CommentViewModel} from "../../../types/comment-types";

export const postsService = {
    async createPost(post: PostInputModel): Promise<PostViewModel | null> {
        const blogName = await blogsRepository.findBlog(post.blogId)
        if (!blogName) return null
        const newPost: WithId<PostDbType> = {
            _id: new ObjectId(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blogName.name,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const createdPost = await postsRepository.createPost(newPost)

        if (!createdPost) {
            return null
        }

        return this.mapPostOutput(newPost)
    },
    async createPostComment(postId: string, content: string, user: UserAccountDBType): Promise<CommentViewModel> {
        const newComment = {
            id: new ObjectId().toString(),
            content: content,
            commentatorInfo: {
                userId: new ObjectId(user._id).toString(),
                userLogin: user.accountData.login
            },
            postId,
            createdAt: new Date().toISOString()
        }
        const createdComment = await postsRepository.createPostComment(newComment)
        return commentsQueryRepository.mapPostCommentsOutput(newComment)
    },
    async delPostById (id: PostViewModel['id']): Promise<boolean> {
        return await postsRepository.deletePost(id)
    },
    async putPostById( body: PostInputModel, id: PostViewModel['id']): Promise<boolean> {
        return await postsRepository.putPost(body, id)
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
}