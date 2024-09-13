import "reflect-metadata"
import { Container } from 'inversify'

import { AuthController } from "./controllers/auth.controller"

import { UsersRepository } from "../users/infra/users.repository"
import { UsersQueryRepository } from "../users/infra/users-query.repository"

import { EmailAdapter } from "../../core/adapters/email.adapter"

import { EmailsManager } from "../../core/managers/email.manager"

import { SecurityService } from "../security/application/security.service"
import { UsersService } from "../users/application/users.service"
import { SecurityRepository } from "../security/infra/security.repository"
import { SecurityQueryRepository } from "../security/infra/sequrity-query.repository"
import { JwtService } from "../../core/services/jwt.service"
import { AuthService } from "./application/auth.service"

export const container = new Container()

container.bind(AuthController).to(AuthController)
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)
container.bind(EmailAdapter).to(EmailAdapter)
container.bind(EmailsManager).to(EmailsManager)
container.bind(SecurityService).to(SecurityService)
container.bind(SecurityRepository).to(SecurityRepository)
container.bind(SecurityQueryRepository).to(SecurityQueryRepository)
container.bind(UsersService).to(UsersService)
container.bind(JwtService).to(JwtService)
container.bind(AuthService).to(AuthService)
