import "reflect-metadata"
import { injectable, inject, Container } from "inversify";

import { NextFunction, Response } from "express";
import { JwtService } from "../core/services/jwt.service";

import { RequestAuthModel } from "../core/request-types";
import { HTTP_STATUSES } from "../utils";
import { UsersService } from "../features/users/application/users.service";
import { SecurityQueryRepository } from "../features/security/infra/sequrity-query.repository";
import { UsersQueryRepository } from "../features/users/infra/users-query.repository";
import { UsersRepository } from "../features/users/infra/users.repository";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(JwtService) private jwtService: JwtService,
    @inject(UsersService) private usersService: UsersService
  ) {}

  public async use(req: RequestAuthModel, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Authorization header is missing or malformed' });
        return 
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Token is missing' });
        return 
      }

      const userId = await this.jwtService.getUserIdByToken(token);

      if (!userId) {
        res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Invalid or expired token' });
        return 
      }

      const foundUser = await this.usersService.findUserById(userId);
      if (!foundUser) {
        res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'User not found' });
        return 
      }

      req.user = foundUser;
      next();

    } catch (error) {
      console.error('Error in AuthMiddleware:', error);
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401); 
    }
  }
}

const container = new Container();

container.bind(JwtService).to(JwtService);
container.bind(UsersService).to(UsersService);
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)
container.bind(AuthMiddleware).to(AuthMiddleware);
container.bind(SecurityQueryRepository).to(SecurityQueryRepository)

export { container };