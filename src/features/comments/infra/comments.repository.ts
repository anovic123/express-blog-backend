import "reflect-metadata"
import { injectable } from "inversify";

import {CommentModel} from "../domain/comment.entity";
import {LikeModel, LikeStatus} from "../domain/like.entity";

import {PostViewModel} from "../../posts/dto/output";

@injectable()
export class CommentsRepository {
    public async updateComment(commentId: string, content: string): Promise<boolean> {
        try {
            const result = await CommentModel.updateOne(
                { id: commentId },
                { $set: { content } }
            );
            return result.modifiedCount > 0;
        } catch (error) {
            console.error(`Error updating comment ${commentId}:`, error);
            return false;
        }
    }

    public async deleteComment(commentId: string): Promise<boolean> {
        try {
            const result = await CommentModel.deleteOne({ id: commentId });
            return result.deletedCount > 0;
        } catch (error) {
            console.error(`Error deleting comment ${commentId}:`, error);
            return false;
        }
    }

    public async likeComment(commentId: string, userId: string, postId: string): Promise<boolean> {
        try {
            await LikeModel.findOneAndUpdate(
                { commentId, authorId: userId },
                { 
                    status: LikeStatus.LIKE,
                    postId,
                    updatedAt: new Date()
                },
                { 
                    upsert: true,
                    new: true, 
                    runValidators: true
                }
            );
            return true;
        } catch (error) {
            console.error(`Error liking comment ${commentId}:`, error);
            return false;
        }
    }
    
    public async dislikeComment(commentId: string, userId: string, postId: string): Promise<boolean> {
        try {
            await LikeModel.findOneAndUpdate(
                { commentId, authorId: userId },
                { 
                    status: LikeStatus.DISLIKE,
                    postId,
                    updatedAt: new Date()
                },
                { 
                    upsert: true, 
                    new: true,   
                    runValidators: true 
                }
            );
            return true;
        } catch (error) {
            console.error(`Error disliking comment ${commentId}:`, error);
            return false;
        }
    }
    
    public async noneStatusComment(commentId: string, userId: string, postId: string): Promise<boolean> {
        try {
            await LikeModel.findOneAndUpdate({
                commentId, authorId: userId
            }, {
                status: LikeStatus.NONE,
                postId,
                updatedAt: new Date()
            }, {
                upsert: true,
                new: true,
                runValidators: true
            })

            return true
        } catch (error) {
            console.error(`Error none status comment ${commentId}:`, error)
            return false
        }
    }

    public async getPostIdByCommentId(id: PostViewModel['id']): Promise<string | null> {
        try {
            const res = await CommentModel.findOne({ id }).lean();
            if (!res?.postId) {
                return null
            }
            return res.postId;
        } catch (error) {
            console.error(`Error while getPostIdByCommentId ${id}`, error)
            return null
        }
    }

    public async deleteAll(): Promise<boolean> {
        try {
            const result = await CommentModel.deleteMany({});
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error deleting all comments:', error);
            return false;
        }
    }

    public async deleteAllLikes(): Promise<boolean> {
        try {
            const result = await LikeModel.deleteMany({})
            return result.deletedCount > 0
        } catch (error) {
            console.error(`Error deleting all likes`, error)
            return false
        }
    }
};
