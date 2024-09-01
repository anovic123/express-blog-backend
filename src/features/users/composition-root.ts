import {UsersRepository} from "./infra/users.repository";
import {UsersQueryRepository} from "./infra/users-query.repository";
import {UsersService} from "./application/users.service";

export const usersRepository = new UsersRepository()
export const usersQueryRepository = new UsersQueryRepository()

export const usersService = new UsersService(usersQueryRepository, usersRepository)