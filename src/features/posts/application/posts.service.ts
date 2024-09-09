import {inject, injectable} from 'inversify';
import {Types} from 'mongoose';

import {UserAccountDBType} from "../../auth/domain/auth.entity";

import {PostsRepository} from "../infra/posts.repository";
import {PostsQueryRepository} from "../infra/posts-query.repository";
import {BlogsRepository} from '../../blogs/infra/blogs.repository';
import {CommentsQueryRepository} from '../../comments/infra/comments-query.repository';

import {PostInputModel} from "../dto/input";
import {PostLikesViewModel, PostViewModel} from "../dto/output";

import {CommentViewModel} from "../../comments/dto/output";

import {PostDbType} from "../domain/post.entity";
import {LikePostStatus} from "../domain/post-like.entity";

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

        return this.postsRepository.mapPostOutput(newPost);
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

    public async likePost(
        postId: string,
        likesInfo: PostLikesViewModel | null,
        likesStatus: LikePostStatus,
        userId: string | undefined,
        userLogin: string
    ): Promise<boolean> {
        if (!userId) return false;
        if (likesInfo?.myStatus === likesStatus) {
            return false;
        }
        switch (likesStatus) {
            case LikePostStatus.NONE:
                if (likesInfo?.myStatus === LikePostStatus.DISLIKE || likesInfo?.myStatus === LikePostStatus.LIKE) {
                    await this.postsRepository.noneStatusPost(userId, postId, userLogin);
                } else if (likesInfo?.myStatus === LikePostStatus.NONE) {

                    await this.postsRepository.likePost(userId, postId, userLogin);
                }

                break;
            case LikePostStatus.LIKE:
                await this.postsRepository.likePost(userId, postId, userLogin);
                break;
            case LikePostStatus.DISLIKE:
                await this.postsRepository.dislikePost(userId, postId, userLogin);
                break;
            default:
                return false;
        }

        return true;
    }
};
