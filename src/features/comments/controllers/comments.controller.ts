import { inject, injectable } from 'inversify';
import { Response } from 'express'

import { CommentsService } from '../application/comments.service';
import { JwtService } from '../../../core/services/jwt.service';

import { CommentsQueryRepository } from '../infra/comments-query.repository';

import { RequestAuthModelWithParams, RequestUserStatusCommentModelWithParams, RequestWithParams } from '../../../core/request-types';

import { HTTP_STATUSES } from "../../../utils";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsService) protected commentsService: CommentsService,
    @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
    @inject(JwtService) protected jwtService: JwtService
  ) {}

  public async deleteComment(req: RequestAuthModelWithParams<{ commentId: string }>, res: Response) {
    try {
      const isOwn = await this.commentsQueryRepository.checkIsOwn(req.params.commentId, req.user!)

      if (!isOwn) {
          res.sendStatus(HTTP_STATUSES.FORBIDDEN)
          return
      }

      const deleteRes = await this.commentsService.deleteComment(req.params.commentId)

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
      console.error(`Error delete comment controller`, error)
    }
  }

  public async getCommentsById(req: RequestWithParams<{ commentId: string }>, res: Response) {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        let accessTokenUserId
        if (accessToken) {
            accessTokenUserId = await this.jwtService.getUserIdByToken(accessToken!);
        }

        const commentsRes = await this.commentsQueryRepository.getCommentById(req.params.commentId, accessTokenUserId)
        if (!commentsRes) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.status(HTTP_STATUSES.OKK_200).send(commentsRes)
    } catch (error) {
        console.error('getCommentsByIdController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async putComment(req: RequestAuthModelWithParams<{ commentId: string }>, res: Response) {
    try {
        const isOwn = await this.commentsQueryRepository.checkIsOwn(req.params.commentId, req.user!)

        if (!isOwn) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN)
            return
        }

        const updatedComment = await this.commentsService.updateComment(req.params.commentId, req.body.content)

        res.sendStatus(HTTP_STATUSES.OKK_200)
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async putLike(
    req: RequestUserStatusCommentModelWithParams<{ commentId: string }>,
    res: Response
  ) {
      try {
          const accessToken = req.headers.authorization?.split(' ')[1];
          
          const accessTokenUserId = await this.jwtService.getUserIdByToken(accessToken!);

          if (!accessTokenUserId) {
              res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
              return
          }

          const likeUpdated = await this.commentsService.likeComment(
              req.params.commentId,
              req.likesInfo!,
              req.body.likeStatus,
              accessTokenUserId
          );

          if (!likeUpdated) {
              res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
              return
          }

          res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      } catch (error) {
          console.error('Error in the PutLikeController', error);
          if (!res.headersSent) {
              res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
          }
      }
  }
}