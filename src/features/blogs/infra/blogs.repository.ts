import { injectable } from 'inversify';
import { Types } from 'mongoose';

import {  BlogDocument, BlogModel } from "../domain/blog.entity";
import {PostDbType, PostModel} from "../../posts/domain/post.entity";

import {BlogInputModel, BlogPostInputModel} from "../dto/input";
import {BlogPostViewModel, BlogViewModel} from "../dto/output";

interface PostDocument extends PostDbType, Document {
    _id: Types.ObjectId;
}

@injectable()
export class BlogsRepository {
    public async create(blog: BlogInputModel): Promise<BlogViewModel | null> {
        try {
            const newBlog = new BlogModel({
                _id: new Types.ObjectId(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            });

            const result = await newBlog.save();

            if (!result) {
                return null;
            }

            return this.mapBlog(result);
        } catch (error) {
            console.error(`create blog ${blog.name}`, error);
            return null;
        }
    }
    public async findBlog(id: BlogViewModel['id']): Promise<BlogViewModel | null> {
        try {
            const res = await BlogModel.findById(new Types.ObjectId(id));
            if (!res) return null;
            return this.mapBlog(res);
        } catch (error) {
            console.error(`findBlog by blog id: ${id}`, error);
            return null;
        }
    }
    public async del(id: BlogViewModel['id']): Promise<boolean> {
        try {
            const result = await BlogModel.deleteOne({ _id: new Types.ObjectId(id) });
            return result.deletedCount === 1;
        } catch (error) {
            console.error(`del blog by blogId: ${id}`, error);
            return false;
        }
    }
    public async updateBlog(blog: BlogInputModel, id: BlogViewModel['id']): Promise<boolean> {
        try {
            const result = await BlogModel.updateOne(
                { _id: new Types.ObjectId(id) },
                {
                    $set: {
                        name: blog.name,
                        description: blog.description,
                        websiteUrl: blog.websiteUrl
                    }
                }
            );
            return result.matchedCount === 1;
        } catch (error) {
            console.error('updateBlog', error);
            return false;
        }
    }
    public async createPostBlog(blogId: BlogViewModel['id'], post: BlogPostInputModel): Promise<BlogPostViewModel | null> {
        try {
            const blog = await this.findBlog(blogId);
            if (!blog) {
                return null;
            }

            const newPost = new PostModel({
                _id: new Types.ObjectId(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            });

            const savedPost = await newPost.save();

            return this.mapPostBlog(savedPost.toObject());
        } catch (error) {
            console.error(`createPostBlog blogId: ${blogId}`, error);
            return null;
        }
    }
    public mapPostBlog(post: PostDocument): BlogPostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        };
    }
    public mapBlog(blog: BlogDocument): BlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        };
    }
    public async deleteAll(): Promise<boolean> {
        try {
            await BlogModel.deleteMany();
            return true;
        } catch (error) {
            console.error('deleteAll blogs', error);
            return false;
        }
    }
}