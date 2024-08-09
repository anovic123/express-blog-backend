import { Request, Response } from 'express'
import {HTTP_STATUSES} from "../../../utils";

export const logoutController = async (req: Request, res: Response) => {
    const requestRefreshToken = req.cookies['refreshToken']

    if (requestRefreshToken){
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }

    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}