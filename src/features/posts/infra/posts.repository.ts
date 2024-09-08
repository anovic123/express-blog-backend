import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';

import {PostDbType, PostModel} from "../domain/post.entity";
import {CommentDBType, CommentModel} from "../../comments/domain/comment.entity";
import { LikeStatus} from "../../comments/domain/like.entity";

import {CommentViewModel} from "../../comments/dto/output";
import {PostViewModel} from "../dto/output";
import {PostInputModel} from "../dto/input";

import { BlogsRepository } from '../../blogs/infra/blogs.repository';

@injectable()
export class PostsRepository {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository
    ) {}
    public async createPost(post: PostDbType): Promise<boolean> {
        try {
            const newPost = await PostModel.create(post);
            return !!newPost;
        } catch (error) {
            console.error('Error creating post:', error);
            return false;
        }
    }

    public async createPostComment(comment: CommentDBType): Promise<CommentViewModel | null> {
        try {
            const result = await CommentModel.create(comment);
            return result ? this.mapPostCommentsOutput(comment) : null;
        } catch (error) {
            console.error('Error creating comment:', error);
            return null;
        }
    }

    public async findPost(id: PostViewModel['id']): Promise<PostDbType | null> {
        try {
            const res = await PostModel.findOne({ _id: new Types.ObjectId(id) }).lean();
            return res;
        } catch (error) {
            console.error('Error finding post:', error);
            return null;
        }
    }

    public async deletePost(id: PostViewModel['id']): Promise<boolean> {
        try {
            const deleteResult = await PostModel.deleteOne({ _id: new Types.ObjectId(id) });
            return deleteResult.deletedCount === 1;
        } catch (error) {
            console.error('Error deleting post:', error);
            return false;
        }
    }

    public async putPost(post: PostInputModel, id: string): Promise<boolean> {
        try {
            const blog = await this.blogsRepository.findBlog(post.blogId);
            if (!blog) return false;

            const result = await PostModel.updateOne(
                { _id: new Types.ObjectId(id) },
                {
                    $set: {
                        ...post,
                        blogName: blog.name
                    }
                }
            );

            return result.matchedCount === 1;
        } catch (error) {
            console.error('Error updating post:', error);
            return false;
        }
    }

    public async deleteAll(): Promise<boolean> {
        try {
            await PostModel.deleteMany();
            return true;
        } catch (error) {
            console.error('Error deleting all posts:', error);
            return false;
        }
    }

    public mapPostCommentsOutput(comment: CommentDBType): CommentViewModel {
        const commentForOutput = {
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.NONE
            }
        }
        return commentForOutput
    }
};
