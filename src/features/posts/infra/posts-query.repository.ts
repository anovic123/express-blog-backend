import "reflect-metadata"
import { injectable } from "inversify";
import {ObjectId, WithId} from "mongodb";

import {getAllPostsHelper, GetAllPostsHelperResult} from "../helper";

import {PostDbType, PostModel} from "../domain/post.entity";

import {CommentDBType, CommentModel} from "../../comments/domain/comment.entity";
import { LikeCommentModel, LikeCommentStatus } from "../../comments/domain/like.entity";

import {BlogViewModel} from "../../blogs/dto/output";
import {PostViewModel} from "../dto/output";
import {LikePostDBType, LikePostModel, LikePostStatus} from "../domain/post-like.entity";
import {Types} from "mongoose";

@injectable()
export class PostsQueryRepository {
    public async getMappedPostById(id: PostViewModel['id'], userId: string | null | undefined): Promise<PostViewModel | null> {
        console.log(userId)
        try {
            return await this.findPostsAndMap(id, userId)
        } catch (error) {
            console.error('getMappedPostById', error)
            return null
        }
    }
    public async getAllPosts(query: GetAllPostsHelperResult, blogId: BlogViewModel['id'], userId?: string | null | undefined) {
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
                items: items.map((i: any) => this.mapPostOutput(i, userId))
            }
        } catch (error) {
            console.log(error)
            return []
        }
    }

    public async getPostsComments(query: GetAllPostsHelperResult, postId: string, userId?: string | null | undefined) {
        const sanitizedQuery = getAllPostsHelper(query);
    
        const filter: { postId?: string; title?: { $regex: string, $options: string } } = {};
        
        if (postId) {
            filter.postId = postId;
        }
    
        if (sanitizedQuery.searchNameTerm) {
            filter.title = { $regex: sanitizedQuery.searchNameTerm, $options: "i" };
        }
    
        const sortDirection = sanitizedQuery.sortDirection === 'asc' ? 1 : -1;
        const sortBy = sanitizedQuery.sortBy || 'createdAt';
    
        try {
            const items = await CommentModel.find(filter)
                .sort({ [sortBy]: sortDirection }) 
                .skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize)
                .limit(sanitizedQuery.pageSize)
                .exec();
    
            const totalCount = await CommentModel.countDocuments(filter);
    
            const mappedItems = await Promise.all(items.map((i: CommentDBType) => this.mapPostCommentsOutput(i, userId)));
    
            return {
                pagesCount: Math.ceil(totalCount / (query.pageSize ?? 10)),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount,
                items: mappedItems
            };
        } catch (error) {
            console.error('Error fetching post comments:', error);
            throw new Error('Could not fetch post comments');
        }
    }

    public async findPostsAndMap(id: PostViewModel['id'], userId?: string | null | undefined): Promise<PostViewModel | null> {
        try {
            const findedPost = await PostModel.findOne({ _id: new ObjectId(id) })

            if (!findedPost) {
                return null
            }

            return this.mapPostOutput(findedPost, userId)
        } catch (error) {
            console.error('findPost', error)
            return null
        }
    }

    public async mapPostOutput(post: WithId<PostDbType>, userId?: string | null | undefined): Promise<PostViewModel> {

        const likes = await LikePostModel.find({ postId: new Types.ObjectId(post._id).toString() });

        const userLike = userId ? likes.find(like => like.authorId === userId) : null;

        const likesCount = likes.filter(l => l.status === LikePostStatus.LIKE).length;
        const dislikesCount = likes.filter(l => l.status === LikePostStatus.DISLIKE).length;
        const myStatus = userLike?.status ?? LikePostStatus.NONE;

        const newestLikes = likes
            .filter(l => l.status === LikePostStatus.LIKE)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 3)
            .map(l => ({
                addedAt: l.createdAt,
                userId: l.authorId,
                login: l.login
            }));

        const postForOutput: PostViewModel = {
            id: new ObjectId(post._id).toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount,
                dislikesCount,
                myStatus,
                newestLikes: newestLikes.length > 0 ? newestLikes : []
            }
        };

        return postForOutput;
    }

    protected async mapPostCommentsOutput(comment: CommentDBType, userId: string | null | undefined) {
        try  {
            const likes = await LikeCommentModel.find({ commentId: comment.id });
            const userLike = userId ? likes.find(like => like.authorId === userId) : null;

            const likesCount = likes.filter(l => l.status === LikeCommentStatus.LIKE).length;
            const dislikesCount = likes.filter(l => l.status === LikeCommentStatus.DISLIKE).length;
            const myStatus = userLike?.status ?? LikeCommentStatus.NONE;

            const commentForOutput = {
                id: comment.id,
                content: comment.content,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin
                },
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount,
                    dislikesCount,
                    myStatus,
                },
            }
            return commentForOutput
        } catch (error) {
            console.error('mapPostCommentsOutput', error)
            return null
        }

    }
}

export const postsQueryRepository = new PostsQueryRepository()
