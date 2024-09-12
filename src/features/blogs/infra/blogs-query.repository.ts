import "reflect-metadata"
import { injectable } from "inversify";
import {ObjectId, WithId} from "mongodb";

import {BlogDocument, BlogModel} from "../domain/blog.entity";

import {PostDbType, PostModel} from "../../posts/domain/post.entity";

import {getAllBlogsHelper, getAllBlogsHelperResult, getBlogPostsHelper, GetBlogPostsHelperResult} from "../helper";

import {BlogPostViewModel, BlogViewModel} from "../dto/output";
import {LikePostDBType, LikePostModel, LikePostStatus} from "../../posts/domain/post-like.entity";
import {PostViewModel} from "../../posts/dto/output";

@injectable()
export class BlogsQueryRepository {
    public async getAllBlogs(query: getAllBlogsHelperResult, blogId: BlogViewModel['id']) {
        const sanitizedQuery = getAllBlogsHelper(query as { [key: string]: string | undefined })

        const byId = blogId ? { blogId: new ObjectId(blogId) } : {}
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
            const res = await BlogModel.findOne({ _id: new ObjectId(id) });
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
    
        const byId = blogId ? { blogId: new ObjectId(blogId) } : {};
    
        const filter: any = {
            ...byId,
        };
    
        const sortDirection = sanitizedQuery.sortDirection === 'asc' ? 1 : -1;
    
        try {
            const items = await PostModel.find(filter)
                .sort({ [sanitizedQuery.sortBy]: sortDirection })
                .skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize)
                .limit(sanitizedQuery.pageSize)
                .exec();
    
            const totalCount = await PostModel.countDocuments(filter);
    
            const postIds = items.map((post) => post._id);
            const likes = await LikePostModel.find({ postId: { $in: postIds } }).exec();
    
            return {
                pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount,
                items: items.map((post: any) => {
                    const postLikes = likes.filter((like) => like.postId.toString() === post._id.toString());
                    const userLike = postLikes.find((like) => like.authorId === userId);
                    return this.mapPostOutput(post, postLikes, userLike);
                })
            };
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    
    protected mapPostOutput(
        post: WithId<PostDbType>,
        likes: LikePostDBType[] = [],
        userLike: LikePostDBType | null = null
    ): PostViewModel {
        const likesCount = likes.filter(l => l.status === LikePostStatus.LIKE).length ?? 0;
        const dislikesCount = likes.filter(l => l.status === LikePostStatus.DISLIKE).length ?? 0;
        const myStatus = userLike?.status ?? LikePostStatus.NONE;
    
        const newestLikes = likes
            .filter(l => l.status === LikePostStatus.LIKE)
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
                likesCount: likesCount || 0,
                dislikesCount: dislikesCount || 0,
                myStatus: myStatus,
                newestLikes: newestLikes.length > 0 ? newestLikes : []
            }
        };
    
        return postForOutput;
    }    
    protected _mapPostBlog(post: BlogPostViewModel): BlogPostViewModel {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }
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