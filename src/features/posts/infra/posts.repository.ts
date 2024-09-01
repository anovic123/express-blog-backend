import { Types } from 'mongoose';

import {PostDbType, PostModel} from "../domain/post.entity";
import {CommentDBType} from "../../comments/domain/comment.entity";

import {CommentViewModel} from "../../comments/dto/output";
import {PostViewModel} from "../dto/output";
import {PostInputModel} from "../dto/input";

import {blogsRepository} from "../../blogs/composition-root";

export class PostsRepository {
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
            const result = await PostModel.create(comment);
            return result ? comment : null;
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
            const blog = await blogsRepository.findBlog(post.blogId);
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
};
