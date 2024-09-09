import "reflect-metadata"
import { Container } from "inversify";

import { CommentsController } from "./controllers/comments.controller";

import {CommentsService} from "./application/comments.service";

import {CommentsRepository} from "./infra/comments.repository";
import {CommentsQueryRepository} from "./infra/comments-query.repository";
import { JwtService } from "../../core/services/jwt.service";
import { SecurityQueryRepository } from "../security/infra/sequrity-query.repository";

export const container = new Container()

container.bind(CommentsController).to(CommentsController)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
container.bind(CommentsService).to(CommentsService)
container.bind(JwtService).to(JwtService)
container.bind(SecurityQueryRepository).to(SecurityQueryRepository)