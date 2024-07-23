import {NextFunction, Response} from "express";
import {RequestAuthModel} from "../types";
import {jwtService} from "../application/jwtService";
import {usersService} from "../features/users/domain/users-service";
import {ObjectId} from "mongodb";
import {HTTP_STATUSES} from "../utils";

export const authMiddleware = async (req: RequestAuthModel, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersService.findUserById(new ObjectId(userId).toString())
        next()
        return
    }
    res.send(HTTP_STATUSES.UNAUTHORIZED_401)
    next()
}