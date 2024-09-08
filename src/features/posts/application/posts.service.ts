import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';

import { UserAccountDBType } from "../../auth/domain/auth.entity";

import {PostsRepository} from "../infra/posts.repository";
import {PostsQueryRepository} from "../infra/posts-query.repository";
import { BlogsRepository } from '../../blogs/infra/blogs.repository';
import { CommentsQueryRepository } from '../../comments/infra/comments-query.repository';

import {PostInputModel} from "../dto/input";
import {PostViewModel} from "../dto/output";

import {CommentViewModel} from "../../comments/dto/output";

import { PostDbType } from "../domain/post.entity";

interface NewPost extends Omit<PostDbType, '_id'> {
    _id: Types.ObjectId;
}

@injectable()
export class PostsService {

    constructor(
        @inject(PostsRepository) protected postsRepository: PostsRepository, 
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository
    ) {}

    public async createPost(post: PostInputModel): Promise<PostViewModel | null> {
        const blog = await this.blogsRepository.findBlog(post.blogId);
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

        const createdPost = await this.postsRepository.createPost(newPost);
        if (!createdPost) return null;

        return this.mapPostOutput(newPost);
    }

    public async createPostComment(postId: string, content: string, user: UserAccountDBType): Promise<CommentViewModel> {
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

        const createdComment = await this.postsRepository.createPostComment(newComment);
        return this.commentsQueryRepository.mapPostCommentsOutput(newComment);
    }

    public async delPostById(id: PostViewModel['id']): Promise<boolean> {
        return await this.postsRepository.deletePost(id);
    }

    public async putPostById(body: PostInputModel, id: PostViewModel['id']): Promise<boolean> {
        return await this.postsRepository.putPost(body, id);
    }

    protected mapPostOutput(post: NewPost): PostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        };
    }
};
