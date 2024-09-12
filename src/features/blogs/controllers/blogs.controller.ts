import "reflect-metadata"
import { inject, injectable } from "inversify";
import { Response } from 'express'

import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQueryAndParams } from "../../../core/request-types";

import { BlogsQueryRepository } from "../infra/blogs-query.repository";

import { BlogsService } from "../application/blogs.service";

import { getAllBlogsHelperResult, GetBlogPostsHelperResult } from "../helper";

import { BlogViewModel } from "../dto/output";
import { BlogInputModel, BlogPostInputModel } from "../dto/input";

import { HTTP_STATUSES } from "../../../utils";
import { JwtService } from "../../../core/services/jwt.service";

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
    @inject(BlogsService) protected blogsService: BlogsService,
    @inject(JwtService) protected jwtService: JwtService
  ) {}

  public async createBlogsPost (req: RequestWithParamsAndBody<{ blogId: string }, BlogPostInputModel>, res: Response<BlogPostInputModel | null>) {
    try {
        const findBlog = await this.blogsQueryRepository.findBlog(req.params.blogId)
        if (!findBlog) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        const newBlogPost = await this.blogsService.createPostBlog(findBlog.id, req.body)

        if (!newBlogPost) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        res.status(HTTP_STATUSES.CREATED_201).json(newBlogPost)
    } catch (error) {
        console.error('createBlogPostController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async createBlog(req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel>) {
    try {
        const newBlog = await this.blogsService.createBlog(req.body)

        if (!newBlog) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(newBlog)
    } catch (error) {
        console.error('createBlogController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async deleteBlog (req: RequestWithParams<{id: string}>, res: Response) {
    try {
        const blogId = req.params.id;
        const blog = await this.blogsQueryRepository.findBlog(blogId);

        if (!blog) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found' });
            return
        }

        await this.blogsService.deleteBlog(req.params.id)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('deleteBlogController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async findBlog (req: RequestWithParams<{id: string}>, res: Response<BlogViewModel | {}>) {
    try {
        const blogById = await this.blogsQueryRepository.findBlog(req.params.id)

        if (!blogById) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json(blogById)
    } catch (error) {
        console.error('findBlogController', error)
    }
  }

  public async getBlogPosts (req: RequestWithQueryAndParams<GetBlogPostsHelperResult, { blogId: string }>, res: Response) {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        let accessTokenUserId
        if (accessToken) {
            accessTokenUserId = await this.jwtService.getUserIdByToken(accessToken!);
        }

        const posts = await this.blogsQueryRepository.getBlogPosts(req.query, req.params.blogId, accessTokenUserId)
        console.log("🚀 ~ BlogsController ~ getBlogPosts ~ posts:", posts)
        res.status(HTTP_STATUSES.OKK_200).json(posts)
    } catch (error) {
        console.error('getBlogPostsController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async getBlogs (req: RequestWithQueryAndParams<getAllBlogsHelperResult, { id: string }>, res: Response) {
    try {
        const blogs = await this.blogsQueryRepository.getAllBlogs(req.query, req.params.id)

        res.status(HTTP_STATUSES.OKK_200).json(blogs)
    } catch (error) {
        console.error('getBlogsController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async putBlogs (req: RequestWithParamsAndBody<{id: string}, BlogInputModel>, res: Response) {

    const updateBlog = await this.blogsService.updateBlog(req.body, req.params.id)

    if (!updateBlog) {
        return res.status(HTTP_STATUSES.NOT_FOUND_404).json({
            errorsMessages: [
                {
                    message: 'Update blog',
                    field: 'Something went wrong'
                }
            ]
        })
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
}