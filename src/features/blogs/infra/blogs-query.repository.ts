import {ObjectId} from "mongodb";

import {BlogDocument, BlogModel} from "../domain/blog.entity";

import {PostModel} from "../../posts/domain/post.entity";

import {getAllBlogsHelper, getAllBlogsHelperResult, getBlogPostsHelper, GetBlogPostsHelperResult} from "../helper";

import {BlogPostViewModel, BlogViewModel} from "../dto/output";

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
    public async getBlogPosts(query: GetBlogPostsHelperResult, blogId: string): Promise<{
        pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: BlogPostViewModel[]
    } | []> {
        const sanitizedQuery = getBlogPostsHelper(query as { [key: string]: string | undefined });

        const byId = blogId ? { blogId } : {};

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

            return {
                pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount,
                items: items.map((b: any) => this._mapPostBlog(b))
            }
        } catch (error) {
            console.log(error);
            return [];
        }
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