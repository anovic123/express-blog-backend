import { Response } from "express";

import {usersQueryRepository} from "../infra/users-query.repository";

import {usersService} from "../application/users.service";
import {authService} from "../../auth/application/auth.service";

import {RequestWithBody} from "../../../types/common";
import {UserInputModel} from "../../../types/users-types";

import {HTTP_STATUSES} from "../../../utils";

export const createUserController = async (req: RequestWithBody<UserInputModel>, res: Response) => {
    try {
        const findUser = await usersService.checkUnique(req.body.login, req.body.password)

        if (!findUser) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
                errorsMessages: [{field: 'email', message: 'email should be unique'}]
            })
            return
        }

        const newUser = await authService.createUser(
            req.body.login,
            req.body.email,
            req.body.password
        )

        if (!newUser) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
                errorsMessages: [{field: 'email', message: 'email should be unique'}]
            })
            return
        }

        res.status(HTTP_STATUSES.CREATED_201).json(usersQueryRepository.outputModelUser(newUser))
    } catch (error) {
        console.error('createUserController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }

}
