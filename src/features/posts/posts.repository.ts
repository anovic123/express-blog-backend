import { ObjectId } from 'mongodb';

import { blogsRepository } from '../blogs/blogs.repository';

import { PostDbType } from '../../db/post-db-type';
import { commentsCollection, postsCollection } from '../../db/db';
import { CommentDBType } from '../../db/comment-db-type';

import { PostInputModel, PostViewModel } from '../../types/posts-types';
import { CommentViewModel } from '../../types/comment-types';

export const postsRepository = {
    async createPost(post: PostDbType): Promise<boolean> {
        try {
            const newPost = await postsCollection.insertOne(post);
            return !!newPost.insertedId;
        } catch (error) {
            console.error('Error creating post:', error);
            return false;
        }
    },

    async createPostComment(comment: CommentDBType): Promise<CommentViewModel | null> {
        try {
            const result = await commentsCollection.insertOne(comment);
            return result.insertedId ? comment : null;
        } catch (error) {
            console.error('Error creating comment:', error);
            return null;
        }
    },

    async findPost(id: PostViewModel['id']): Promise<PostDbType | null> {
        try {
            const res = await postsCollection.findOne({ _id: new ObjectId(id) });
            return res;
        } catch (error) {
            console.error('Error finding post:', error);
            return null;
        }
    },

    async deletePost(id: PostViewModel['id']): Promise<boolean> {
        try {
            const deleteResult = await postsCollection.deleteOne({ _id: new ObjectId(id) });
            return deleteResult.deletedCount === 1;
        } catch (error) {
            console.error('Error deleting post:', error);
            return false;
        }
    },

    async putPost(post: PostInputModel, id: string): Promise<boolean> {
        try {
            const blog = await blogsRepository.findBlog(post.blogId);
            if (!blog) return false;

            const result = await postsCollection.updateOne(
                { _id: new ObjectId(id) },
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
    },

    async deleteAll(): Promise<boolean> {
        try {
            await postsCollection.deleteMany();
            return true;
        } catch (error) {
            console.error('Error deleting all posts:', error);
            return false;
        }
    }
};
