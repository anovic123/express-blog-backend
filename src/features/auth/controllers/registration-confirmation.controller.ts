import { Response } from 'express';

import { HTTP_STATUSES } from "../../../utils";

import { authService } from '../composition-root';

import {RequestWithBody} from "../../../core/request-types";

export const registrationConfirmationController = async (req: RequestWithBody<{ code: string }>, res: Response) => {
    try {
        const result = await authService.confirmEmail(req.body.code);

        if (result) {
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }

        return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: [{ message: 'Wrong code', field: "code" }] });
    } catch (error) {
        console.error('registrationConfirmationController', error);
        return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).json({ errorsMessages: [{ message: 'Internal server error' }] });
    }
};
