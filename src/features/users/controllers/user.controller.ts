import { inject, injectable } from 'inversify'
import { Response, Request } from 'express'

import { UsersQueryRepository } from '../infra/users-query.repository';

import { UsersService } from '../application/users.service';
import { AuthService } from '../../auth/application/auth.service';

import { HTTP_STATUSES } from '../../../utils';

import { RequestWithBody, RequestWithParams } from '../../../core/request-types';

import { UserInputModel } from '../dto';

import { getUsersHelper } from "../helper";

@injectable()
export class UsersController {
  constructor(@inject(UsersService) protected usersService: UsersService, @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
    @inject(AuthService) protected authService: AuthService) {}

  public async createUser(req: RequestWithBody<UserInputModel>, res: Response) {
    try {
      const findUser = await this.usersService.checkUnique(req.body.login, req.body.password)

      if (!findUser) {
          res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
              errorsMessages: [{field: 'email', message: 'email should be unique'}]
          })
          return
      }

      const newUser = await this.authService.createUser(
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

      res.status(HTTP_STATUSES.CREATED_201).json(this.usersQueryRepository.outputModelUser(newUser))
  } catch (error) {
      console.error('createUserController', error)
      res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
  }
  }

  public async deleteUser(req: RequestWithParams<{ id: string }>, res: Response) {
    const userId = req.params.id

    try {
        const user = await this.usersService.findUserById(userId)
      
        await this.usersService.deleteUser(userId)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('deleteUserController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async getUsers(req: Request, res: Response) {
    try {
      const sanitizedQuery = getUsersHelper(req.query as { [key: string]: string | undefined })

      const users = await this.usersService.allUsers(sanitizedQuery)

      res.status(200).send(users)
  } catch (error) {
      console.error('getUsersController', error)
      res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
  }
  }
}