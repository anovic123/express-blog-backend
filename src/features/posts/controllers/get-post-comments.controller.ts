import { Response } from 'express'

import {postsQueryRepository} from "../composition-root";

import {GetAllPostsHelperResult} from "../helper";

import { jwtService } from '../../../core/services/jwt.service';
import {RequestWithQueryAndParams} from "../../../core/request-types";

import {HTTP_STATUSES} from "../../../utils";

export const getPostCommentsController = async (req: RequestWithQueryAndParams<GetAllPostsHelperResult,{ postId: string }>, res: Response) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        let accessTokenUserId
        if (accessToken) {
            accessTokenUserId = await jwtService.getUserIdByToken(accessToken!);
        }

        const commentsRes = await postsQueryRepository.getPostsComments(req.query, req.params.postId, accessTokenUserId)

        res.status(HTTP_STATUSES.OKK_200).json(commentsRes)
    } catch (error) {
        console.error('getPostCommentsController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }

}