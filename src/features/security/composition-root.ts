import {SecurityRepository} from "./infra/security.repository";
import {SecurityQueryRepository} from "./infra/sequrity-query.repository";

import {SecurityService} from "./application/security.service";

export const securityRepository = new SecurityRepository()
export const securityQueryRepository = new SecurityQueryRepository()

export const securityService = new SecurityService(securityRepository, securityQueryRepository)