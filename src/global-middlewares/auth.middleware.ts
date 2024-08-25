import {NextFunction, Response} from "express";

import {jwtService} from "../features/auth/application/jwt.service";
import {usersService} from "../features/users/application/users.service";

import {RequestAuthModel} from "../types/common";

import {HTTP_STATUSES} from "../utils";

export const authMiddleware = async (req: RequestAuthModel, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeaders = req.headers.authorization;

        if (!authHeaders) {
            res.status(HTTP_STATUSES.UNAUTHORIZED_401).json('Authorization header is missing');
            return;
        }

        const token = authHeaders.split(' ')[1];
        if (!token) {
            res.status(HTTP_STATUSES.UNAUTHORIZED_401).json('Token is missing');
            return;
        }

        const userId = await jwtService.getUserIdByToken(token);
        if (!userId) {
            res.status(HTTP_STATUSES.UNAUTHORIZED_401).json('Invalid token');
            return;
        }

        const findedUser = await usersService.findUserById(userId);
        if (!findedUser) {
            res.status(HTTP_STATUSES.UNAUTHORIZED_401).json('User not found');
            return;
        }

        req.user = findedUser;
        next();
    } catch (error) {
        console.log('Error in authMiddleware:', error);
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
};
