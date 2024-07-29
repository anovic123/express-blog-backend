import { blogsRepository } from '../blogs/blogsRepository';
import { PostDbType } from '../../db/post-db-type';
import { commentsCollection, postsCollection } from '../../db/db';
import { CommentDBType } from "../../db/comment-db-type";
import { PostInputModel } from '../../input-output-types/posts-types';
import { ObjectId } from "mongodb";

export const postsRepository = {
    async createPost(post: PostDbType): Promise<string> {
        try {
            const result = await postsCollection.insertOne(post);
            return result.insertedId.toString();
        } catch (error) {
            console.error("Error creating post:", error);
            throw new Error("Failed to create post");
        }
    },

    async createPostComment(comment: CommentDBType): Promise<CommentDBType> {
        try {
            await commentsCollection.insertOne(comment);
            return comment;
        } catch (error) {
            console.error("Error creating post comment:", error);
            throw new Error("Failed to create post comment");
        }
    },

    async find(id: string): Promise<PostDbType | null> {
        try {
            if (!ObjectId.isValid(id)) {
                return null;
            }
            const postId = new ObjectId(id);
            const post = await postsCollection.findOne({ _id: postId });
            return post || null;
        } catch (error) {
            console.error("Error finding post:", error);
            return null;
        }
    },

    async deletePost(id: string): Promise<boolean> {
        try {
            if (!ObjectId.isValid(id)) {
                return false;
            }
            const postId = new ObjectId(id);
            const result = await postsCollection.deleteOne({ _id: postId });
            return result.deletedCount === 1;
        } catch (error) {
            console.error("Error deleting post:", error);
            return false;
        }
    },

    async updatePost(post: PostInputModel, id: string): Promise<boolean> {
        try {
            const blog = await blogsRepository.findBlog(post.blogId);
            if (!blog) {
                return false;
            }

            if (!ObjectId.isValid(id)) {
                return false;
            }
            const postId = new ObjectId(id);

            const result = await postsCollection.updateOne(
                { _id: postId },
                {
                    $set: {
                        ...post,
                        blogName: blog.name,
                    },
                }
            );

            return result.matchedCount === 1;
        } catch (error) {
            console.error("Error updating post:", error);
            return false;
        }
    },

    async deleteAll(): Promise<boolean> {
        try {
            await postsCollection.deleteMany();
            return true;
        } catch (error) {
            console.error("Error deleting all posts:", error);
            return false;
        }
    },
};
