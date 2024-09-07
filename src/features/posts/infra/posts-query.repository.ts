import {ObjectId, WithId} from "mongodb";

import {getAllPostsHelper, GetAllPostsHelperResult} from "../helper";

import {PostDbType, PostModel} from "../domain/post.entity";

import {CommentDBType, CommentModel} from "../../comments/domain/comment.entity";
import { LikeModel, LikeStatus } from "../../comments/domain/like.entity";

import {BlogViewModel} from "../../blogs/dto/output";
import {PostViewModel} from "../dto/output";

export class PostsQueryRepository {
    public async getMappedPostById(id: PostViewModel['id']): Promise<PostViewModel | null> {
        return await this.findPostsAndMap(id)
    }
    public async getPostsCommentsLength(id: string): Promise<number> {
        const commentsRes = await CommentModel.find({ _id: new ObjectId(id) }).exec()
        return commentsRes.length
    }
    public async getAllPosts(query: GetAllPostsHelperResult, blogId: BlogViewModel['id']) {
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
                items: items.map((i: any) => this.mapPostOutput(i))
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
    
    public async findPostsAndMap(id: PostViewModel['id']): Promise<PostViewModel | null> {
        const post = await this.findPost(id)
        if (!post) {
            return null
        }
        return this.mapPostOutput(post)
    }
    public async findPost(id: PostViewModel['id']): Promise<WithId<PostDbType> | null> {
        const res = await PostModel.findOne({ _id: new ObjectId(id) })

        if (!res) {
            return null
        }

        return res
    }
    protected mapPostOutput(post: WithId<PostDbType>) {
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
    }
    protected async mapPostCommentsOutput(comment: CommentDBType, userId: string | null | undefined) {
        const likes = await LikeModel.find({ commentId: comment.id });
        const userLike = userId ? likes.find(like => like.authorId === userId) : null;

        const likesCount = likes.filter(l => l.status === LikeStatus.LIKE).length;
        const dislikesCount = likes.filter(l => l.status === LikeStatus.DISLIKE).length;
        const myStatus = userLike?.status ?? LikeStatus.NONE;
        
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
    }
}