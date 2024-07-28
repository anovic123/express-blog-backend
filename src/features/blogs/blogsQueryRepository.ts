import {ObjectId} from "mongodb";

import {BlogPostViewModel, BlogViewModel} from "../../input-output-types/blogs-types";

import {getAllBlogsHelper, getAllBlogsHelperResult, getBlogPostsHelper, GetBlogPostsHelperResult} from "./helper";

import {blogsCollection, postsCollection} from "../../db/db";

import {BlogDbType} from "../../db/blog-db-type";

export const blogsQueryRepository = {
    async getAlLBlogs(query: getAllBlogsHelperResult, blogId:  BlogDbType['id']) {
        const sanitizedQuery = getAllBlogsHelper(query as { [key: string]: string | undefined })

        const byId = blogId ? { blogId: new ObjectId(blogId) } : {}
        const search = sanitizedQuery.searchNameTerm ? { name: { $regex: sanitizedQuery.searchNameTerm, $options: "i" } } : {}

        const filter: any = {
            ...byId,
            ...search,
        }

        try {
            const items: any = await blogsCollection.find(filter).sort(sanitizedQuery.sortBy, query.sortDirection).skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize).limit(sanitizedQuery.pageSize).toArray()

            const totalCount = await blogsCollection.countDocuments(filter)

            return {
                pagesCount: Math.ceil(totalCount / (sanitizedQuery.pageSize ?? 19)),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount,
                items: items.map((b: any) => this.map(b))
            }
        } catch (error) {
            console.log(error)
            return []
        }
    },
    async findAndMap(id: string): Promise<BlogViewModel | null> {
        const blog = await this.findBlog(id)!
        if (!blog) {
            return null
        }
        return this.map(blog)
    },
    async findBlog(id: string): Promise<BlogViewModel | null> {
        const res = await blogsCollection.findOne({ id: id });
        if (!res) return null
        return this.map(res)
    },
    async getBlogPosts(query: GetBlogPostsHelperResult, blogId: string): Promise<{
        pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: BlogPostViewModel[]
    } | []> {
        const sanitizedQuery = getBlogPostsHelper(query as { [key: string]: string| undefined })

        const byId = blogId ? { blogId } : {}

        const filter: any = {
            ...byId,
        }

        try {
            const items: any = await postsCollection.find(filter).sort(sanitizedQuery?.sortBy, sanitizedQuery.sortDirection).skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize).limit(sanitizedQuery.pageSize).toArray()

            const totalCount = await postsCollection.countDocuments(filter)

            return {
                pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount,
                items: items.map((b: any) => this.mapPostBlog(b))
            }
        } catch (error) {
            console.log(error)
            return []
        }
    },
    mapPostBlog(post: BlogPostViewModel): BlogPostViewModel {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }
    },
    map(blog: BlogDbType) {
        const blogForOutput: BlogViewModel = {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
        return blogForOutput
    }
}