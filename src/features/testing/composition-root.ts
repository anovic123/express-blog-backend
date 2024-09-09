import "reflect-metadata"
import { Container } from 'inversify'

import { TestingController } from "./controllers/testing.controller"

import { TestingService } from "./application/testing.service"

import { BlogsRepository } from "../blogs/infra/blogs.repository"
import { UsersRepository } from "../users/infra/users.repository"
import { PostsRepository } from "../posts/infra/posts.repository"
import { CommentsRepository } from "../comments/infra/comments.repository"
import { RateLimitRepository } from "../../core/infra/rate-limit.repository"
import { SecurityRepository } from "../security/infra/security.repository"

export const container = new Container()

container.bind(TestingService).to(TestingService)
container.bind(TestingController).to(TestingController)
container.bind(UsersRepository).to(UsersRepository)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(PostsRepository).to(PostsRepository)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(RateLimitRepository).to(RateLimitRepository)
container.bind(SecurityRepository).to(SecurityRepository)
