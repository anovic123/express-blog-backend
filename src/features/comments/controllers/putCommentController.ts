import { Response } from 'express'

import {RequestWithParams} from "../../../core/request-types";

import {HTTP_STATUSES} from "../../../utils";

export const putCommentController = async (req: RequestWithParams<{ commentId: string }>, res: Response) => {
    try {
        res.sendStatus(HTTP_STATUSES.OKK_200)
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}