import { NextFunction, Response } from "express";

import { RequestAuthModel } from "../types/common";

import { jwtService } from "../application/jwt.service";

import { usersService } from "../features/users/domain/users.service";

import { HTTP_STATUSES } from "../utils";

export const authMiddleware = async (req: RequestAuthModel, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeaders = req.headers.authorization;

        if (!authHeaders) {
            res.status(HTTP_STATUSES.UNAUTHORIZED_401).send('Authorization header is missing');
            return;
        }

        const token = authHeaders.split(' ')[1];

        if (!token) {
            res.status(HTTP_STATUSES.UNAUTHORIZED_401).send('Token is missing');
            return;
        }

        const userId = await jwtService.getUserIdByToken(token);
        if (!userId) {
            res.status(HTTP_STATUSES.UNAUTHORIZED_401).send('Invalid token');
            return;
        }

        const findedUser = await usersService.findUserById(userId);
        if (!findedUser) {
            res.status(HTTP_STATUSES.UNAUTHORIZED_401).send('User not found');
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
