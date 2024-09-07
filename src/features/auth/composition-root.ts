import { emailAdapter } from "../../core/adapters/email.adapter";
import { emailManager } from "../../core/managers/email.manager";

import { AuthService } from "./application/auth.service";

import { usersQueryRepository, usersRepository } from "../users/composition-root";
import { securityService } from "../security/composition-root";

export const authService = new AuthService(usersRepository, usersQueryRepository, emailAdapter, emailManager,
  securityService
)
