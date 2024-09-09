import "reflect-metadata"
import { Container } from 'inversify'

import {BlogsRepository} from "./infra/blogs.repository";
import {BlogsQueryRepository} from "./infra/blogs-query.repository";
import {BlogsService} from "./application/blogs.service";
import { BlogsController } from "./controllers/blogs.controller";


export const container = new Container()

container.bind(BlogsController).to(BlogsController)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
container.bind(BlogsService).to(BlogsService)
