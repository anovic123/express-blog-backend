import { Types } from 'mongoose';

import { UserAccountDBType } from "../../auth/domain/auth.entity";

import { blogsRepository } from "../../blogs/infra/blogs.repository";
import { postsRepository } from "../infra/posts.repository";

import { commentsQueryRepository } from "../../comments/infra/comments-query.repository"

import { PostInputModel, PostViewModel } from "../../../types/posts-types";
import { CommentViewModel } from "../../../types/comment-types";

import { PostDbType } from "../domain/post.entity";


interface NewPost extends Omit<PostDbType, '_id'> {
    _id: Types.ObjectId;
}

export const postsService = {
    async createPost(post: PostInputModel): Promise<PostViewModel | null> {
        const blog = await blogsRepository.findBlog(post.blogId);
        if (!blog) return null;

        const newPost: NewPost = {
            _id: new Types.ObjectId(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };

        const createdPost = await postsRepository.createPost(newPost);
        if (!createdPost) return null;

        return this.mapPostOutput(newPost);
    },

    async createPostComment(postId: string, content: string, user: UserAccountDBType): Promise<CommentViewModel> {
        const newComment = {
            id: new Types.ObjectId().toString(),
            content,
            commentatorInfo: {
                userId: new Types.ObjectId(user._id).toString(),
                userLogin: user.accountData.login,
            },
            postId,
            createdAt: new Date().toISOString(),
        };

        const createdComment = await postsRepository.createPostComment(newComment);
        return commentsQueryRepository.mapPostCommentsOutput(newComment);
    },

    async delPostById(id: PostViewModel['id']): Promise<boolean> {
        return await postsRepository.deletePost(id);
    },

    async putPostById(body: PostInputModel, id: PostViewModel['id']): Promise<boolean> {
        return await postsRepository.putPost(body, id);
    },

    mapPostOutput(post: NewPost): PostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        };
    },
};
