import "reflect-metadata"
import { Container } from 'inversify'

import { UsersController } from "./controllers/user.controller";
import {UsersService} from "./application/users.service";
import {UsersQueryRepository} from "./infra/users-query.repository";
import {UsersRepository} from "./infra/users.repository";
import { AuthService } from "../auth/application/auth.service";
import { EmailAdapter } from "../../core/adapters/email.adapter";
import { SecurityService } from "../security/application/security.service";
import { EmailsManager } from "../../core/managers/email.manager";
import { SecurityRepository } from "../security/infra/security.repository";
import { SecurityQueryRepository } from "../security/infra/sequrity-query.repository";
import { JwtService } from "../../core/services/jwt.service";

export const container = new Container()

container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersQueryRepository).to(UsersQueryRepository)
container.bind(UsersRepository).to(UsersRepository)
container.bind(AuthService).to(AuthService)
container.bind(EmailAdapter).to(EmailAdapter)
container.bind(EmailsManager).to(EmailsManager)
container.bind(SecurityService).to(SecurityService)
container.bind(SecurityQueryRepository).to(SecurityQueryRepository)
container.bind(SecurityRepository).to(SecurityRepository)
container.bind(JwtService).to(JwtService)