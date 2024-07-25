import { Request, Response } from 'express';
import { RequestAuthModel, RequestWithParams } from "../../../types";
import { commentsRepository } from "../commentsRepository";
import { HTTP_STATUSES } from "../../../utils";

interface RequestControllerModel extends RequestAuthModel {
    params: {
        commentId: string;
    };
}

export const putCommentController = async (req: RequestControllerModel, res: Response) => {
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
}
