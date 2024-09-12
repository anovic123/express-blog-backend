import "reflect-metadata"
import { Container } from 'inversify'

import {BlogsRepository} from "./infra/blogs.repository";
import {BlogsQueryRepository} from "./infra/blogs-query.repository";
import {BlogsService} from "./application/blogs.service";
import { BlogsController } from "./controllers/blogs.controller";
import { JwtService } from "../../core/services/jwt.service";
import { SecurityQueryRepository } from "../security/infra/sequrity-query.repository";


export const container = new Container()

container.bind(BlogsController).to(BlogsController)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
container.bind(BlogsService).to(BlogsService)
container.bind(JwtService).to(JwtService)
container.bind(SecurityQueryRepository).to(SecurityQueryRepository)