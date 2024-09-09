import "reflect-metadata"
import { Container } from 'inversify'

import {SecurityRepository} from "./infra/security.repository";
import {SecurityQueryRepository} from "./infra/sequrity-query.repository";

import {SecurityService} from "./application/security.service";
import { JwtService } from "../../core/services/jwt.service";

import { SecurityController } from "./controllers/security.controller";

export const container = new Container()

container.bind(SecurityController).to(SecurityController)
container.bind(SecurityRepository).to(SecurityRepository)
container.bind(SecurityQueryRepository).to(SecurityQueryRepository)
container.bind(SecurityService).to(SecurityService)
container.bind(JwtService).to(JwtService)
