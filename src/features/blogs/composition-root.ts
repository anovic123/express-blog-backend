import {BlogsRepository} from "./infra/blogs.repository";
import {BlogsQueryRepository} from "./infra/blogs-query.repository";
import {BlogsService} from "./application/blogs.service";

export const blogsRepository = new BlogsRepository()
export const blogsQueryRepository = new BlogsQueryRepository()

export const blogsService = new BlogsService(blogsRepository, blogsQueryRepository)