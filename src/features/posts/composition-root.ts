import "reflect-metadata"
import { Container } from 'inversify'

import {PostsRepository} from "./infra/posts.repository";
import { BlogsRepository } from "../blogs/infra/blogs.repository";
import {PostsQueryRepository} from "./infra/posts-query.repository";
import { CommentsQueryRepository } from "../comments/infra/comments-query.repository";

import {PostsService} from "./application/posts.service";

import { PostsController } from "./controllers/posts.controller";
import { JwtService } from "../../core/services/jwt.service";
import { SecurityQueryRepository } from "../security/infra/sequrity-query.repository";
import {UsersQueryRepository} from "../users/infra/users-query.repository";


export const container = new Container()

container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostsRepository).to(PostsRepository)
container.bind(PostsQueryRepository).to(PostsQueryRepository)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
container.bind(JwtService).to(JwtService)
container.bind(SecurityQueryRepository).to(SecurityQueryRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)