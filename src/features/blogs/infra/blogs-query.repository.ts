import "reflect-metadata"
import { injectable } from "inversify";
import { Types } from "mongoose";

import {BlogDocument, BlogModel} from "../domain/blog.entity";

import {PostDbType, PostModel} from "../../posts/domain/post.entity";

import {getAllBlogsHelper, getAllBlogsHelperResult, getBlogPostsHelper, GetBlogPostsHelperResult} from "../helper";

import {BlogPostViewModel, BlogViewModel} from "../dto/output";
import {LikePostDBType, LikePostModel, LikePostStatus} from "../../posts/domain/post-like.entity";
import {PostViewModel} from "../../posts/dto/output";

interface PostDocument extends PostDbType, Document {
    _id: Types.ObjectId;
}

@injectable()
export class BlogsQueryRepository {
    public async getAllBlogs(query: getAllBlogsHelperResult, blogId: BlogViewModel['id']) {
        const sanitizedQuery = getAllBlogsHelper(query as { [key: string]: string | undefined })

        const byId = blogId ? { blogId: new Types.ObjectId(blogId) } : {}
        const search = sanitizedQuery.searchNameTerm ? { name: { $regex: sanitizedQuery.searchNameTerm, $options: "i" } } : {}

        const filter: any = {
            ...byId,
            ...search,
        }

        try {
            const sortDirection = sanitizedQuery.sortDirection === 'asc' ? 1 : -1
            const items: any = await BlogModel.find(filter).sort(sanitizedQuery.sortBy, { [ sanitizedQuery.sortDirection ]: sortDirection }).skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize).limit(sanitizedQuery.pageSize).exec()

            const totalCount = await BlogModel.countDocuments(filter)

            return {
                pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount,
                items: items.map((b: any) => this._mapBlog(b))
            }
        } catch (error) {
            console.log(error)
            return []
        }
    }
    public async findBlog(id: BlogViewModel['id']): Promise<BlogViewModel | null> {
        try {
            const res = await BlogModel.findOne({ _id: new Types.ObjectId(id) });
            if (!res) return null
            return this._mapBlog(res)
        } catch (error) {
            console.error(`findBlog id: ${id}`, error)
            return null
        }

    }
    public async getBlogPosts(query: GetBlogPostsHelperResult, blogId: string, userId: string | null | undefined): Promise<{
        pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: BlogPostViewModel[]
    } | []> {
        const sanitizedQuery = getBlogPostsHelper(query as { [key: string]: string | undefined });
    
        const byId = blogId ? { blogId: new Types.ObjectId(blogId) } : {};
    
        const filter: any = {
            ...byId,
        };
    
        const sortDirection = sanitizedQuery.sortDirection === 'asc' ? 1 : -1;
        const sortBy = sanitizedQuery.sortBy || 'createdAt';
    
        try {
            const items = await PostModel.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize)
                .limit(sanitizedQuery.pageSize)
                .exec();
    
            const totalCount = await PostModel.countDocuments(filter);
    
            const mappedItems = await Promise.all(items.map((i: any) => this.mapPostOutput(i, userId)));
    
            return {
                pagesCount: Math.ceil(totalCount / (query.pageSize ?? 10)),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount,
                items: mappedItems
            }
        } catch (error) {
            console.log(error);
            return {
                pagesCount: 0,
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount: 0,
                items: []
            };
        }
    }
    
    public async mapPostOutput(post: PostDocument, userId?: string | null | undefined): Promise<PostViewModel> {
        const likes = await LikePostModel.find({ postId: new Types.ObjectId(post._id).toString() });

        const userLike = userId ? likes.find(like => like.authorId === userId) : null;

        const likesCount = likes.filter(l => l.status === LikePostStatus.LIKE).length ?? 0;
        const dislikesCount = likes.filter(l => l.status === LikePostStatus.DISLIKE).length ?? 0;
        const myStatus = userLike?.status ?? LikePostStatus.NONE;

        const newestLikes = likes
            .filter(l => l.status === LikePostStatus.LIKE)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3)
            .map(l => ({
                addedAt: l.createdAt,
                userId: l.authorId,
                login: l.login
            }));

        const postForOutput: PostViewModel = {
            id: new Types.ObjectId(post._id).toString(),
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
    protected _mapBlog(blog: BlogDocument) {
        const blogForOutput: BlogViewModel = {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
        return blogForOutput
    }
}

export const blogsQueryRepository = new BlogsQueryRepository()