import "reflect-metadata"
import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { Response, Request } from "express";

import {
    RequestAuthModelWithParamsAndBody,
    RequestUserStatusPostModelWithParams,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQueryAndParams
} from "../../../core/request-types";

import { PostsQueryRepository } from "../infra/posts-query.repository";
import {UsersQueryRepository} from "../../users/infra/users-query.repository";

import { PostsService } from "../application/posts.service";
import { JwtService } from "../../../core/services/jwt.service";

import { PostInputModel } from "../dto/input";
import { PostViewModel } from "../dto/output";

import { GetAllPostsHelperResult } from "../helper";

import { HTTP_STATUSES } from "../../../utils";

@injectable()
export class PostsController {
  constructor(
    @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
    @inject(PostsService) protected postsService: PostsService,
    @inject(JwtService) protected jwtService: JwtService,
    @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
  ) {}

  public async createPostComment (req: RequestAuthModelWithParamsAndBody<{ postId: string }, { content: string }>, res: Response) {
    const postId = new Types.ObjectId(req.params.postId);

    if (!Types.ObjectId.isValid(postId)) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }
    try {
        const existedPost = await this.postsQueryRepository.findPostsAndMap(req.params.postId)
        if (!existedPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const newComment = await this.postsService.createPostComment(req.params.postId, req.body.content, req.user!)

        res.status(HTTP_STATUSES.CREATED_201).json(newComment)
    } catch (error) {
        console.error('createPostCommentController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async createPost (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel>) {
    try {
        const newPost = await this.postsService.createPost(req.body)

        if (!newPost) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(newPost)
    } catch (error) {
        console.error('createPostController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async deletePost (req: RequestWithParams<{id: string}>, res: Response) {
    try {
        await this.postsService.delPostById(req.params.id)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('deletePostController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async findPost (req: RequestWithParams<{id: PostViewModel['id']}>, res: Response<PostViewModel | {}>) {
    try {
        const accessToken = req.cookies['refreshToken'];
          
        const accessTokenUserId = await this.jwtService.getUserIdByToken(accessToken!);

        const blogById = await this.postsQueryRepository.getMappedPostById(req.params.id, accessTokenUserId)

        if (!blogById) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.status(HTTP_STATUSES.OKK_200).json(blogById)
    } catch (error) {
        console.error('findPostController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async getPostsComments (req: RequestWithQueryAndParams<GetAllPostsHelperResult,{ postId: string }>, res: Response) {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        let accessTokenUserId
        if (accessToken) {
            accessTokenUserId = await this.jwtService.getUserIdByToken(accessToken!);
        }

        const commentsRes = await this.postsQueryRepository.getPostsComments(req.query, req.params.postId, accessTokenUserId)

        res.status(HTTP_STATUSES.OKK_200).json(commentsRes)
    } catch (error) {
        console.error('getPostCommentsController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async getPosts (req: RequestWithQueryAndParams<GetAllPostsHelperResult, { id: PostViewModel['id'] }>, res: Response<any>) {
    try {
        const accessToken = req.cookies['refreshToken'];
          
        const accessTokenUserId = await this.jwtService.getUserIdByToken(accessToken!);
        const posts = await this.postsQueryRepository.getAllPosts(req.query, req.params.id, accessTokenUserId)
        res.status(HTTP_STATUSES.OKK_200).json(posts)
    } catch (error) {
        console.error('getPostsController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async putPosts (req: RequestWithParamsAndBody<{id: string}, PostInputModel>, res: Response) {
      try {
          const putRes = await this.postsService.putPostById(req.body, req.params.id)

          if (!putRes) {
              res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
              return
          }

          res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
      } catch (error) {
          console.error('putPost controller', error)
          res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
      }
  }

  public async putPostLike (req: RequestUserStatusPostModelWithParams<{ postId: string }>, res: Response) {
      try {
          const accessToken = req.headers.authorization?.split(' ')[1];

          const accessTokenUserId = await this.jwtService.getUserIdByToken(accessToken!);

          if (!accessTokenUserId) {
              res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
              return
          }

          const userLogin = await this.usersQueryRepository.findUserById(accessTokenUserId)

          if (!userLogin) {
              res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
              return
          }

          const postLikeUpdated = await this.postsService.likePost(
              req.params.postId,
              req.likesInfo!,
              req.body.likeStatus,
              accessTokenUserId,
              userLogin.accountData.login
          );

          if (!postLikeUpdated) {
              res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
              return
          }

          res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
      } catch (error) {
          res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
          console.error('putPostLike', error)
      }
  }
}