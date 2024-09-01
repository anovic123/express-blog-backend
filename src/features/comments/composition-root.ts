import {CommentsRepository} from "./infra/comments.repository";
import {CommentsQueryRepository} from "./infra/comments-query.repository";
import {CommentsService} from "./application/comments.service";

export const commentsRepository = new CommentsRepository()
export const commentsQueryRepository = new CommentsQueryRepository()

export const commentsService = new CommentsService(commentsRepository, commentsQueryRepository)