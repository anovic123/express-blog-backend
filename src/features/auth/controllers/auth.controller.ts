import "reflect-metadata"
import { inject, injectable } from "inversify";
import { Response, Request } from 'express'

import { UsersService } from "../../users/application/users.service";
import { SecurityService } from "../../security/application/security.service";
import { JwtService } from "../../../core/services/jwt.service";
import { SecurityQueryRepository } from "../../security/infra/sequrity-query.repository";
import { AuthService } from "../application/auth.service";

import {HTTP_STATUSES} from "../../../utils";

import { AuthInputModel } from "../dto";

import { RequestAuthModel, RequestWithBody } from "../../../core/request-types";

@injectable()
export class AuthController {
  constructor (
    @inject(UsersService) protected usersService: UsersService,
    @inject(SecurityService) protected securityService: SecurityService,
    @inject(SecurityQueryRepository) protected securityQueryRepository: SecurityQueryRepository,
    @inject(JwtService) protected jwtService: JwtService,
    @inject(AuthService) protected authService: AuthService
  ) {}

  public async loginUser(req: RequestWithBody<AuthInputModel>, res: Response<{ accessToken: string }>) {
    try {
      const user = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
      const userAgent = req.headers['user-agent'] || 'Unknown';

      if (!user) {
          res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
          return
      }

      const newDeviceRes = await this.securityService.addNewUserDevice(user, req?.ip, userAgent)

      if (!newDeviceRes.data) {
          res.sendStatus(newDeviceRes.statusCode)
          return
      }

      const { accessToken, refreshToken } = newDeviceRes.data

      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
          .header('Authorization', accessToken)
          .send({ accessToken });
  } catch (error) {
      console.error('loginController', error)
      res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
  }

  public async logoutUser(req: Request, res: Response) {
    const requestRefreshToken = req.cookies['refreshToken'];

    try {
        const refreshTokenData = await this.jwtService.getDataFromRefreshToken(requestRefreshToken)

        if (!refreshTokenData) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return
        }
        const checkDeviceUser = await this.securityQueryRepository.checkUserDeviceById(refreshTokenData.userId, refreshTokenData.deviceId)

        if (checkDeviceUser) {
            await this.securityService.deleteUserDeviceById(refreshTokenData?.deviceId);
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return;
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
  }

  public async me(req: RequestAuthModel, res: Response) {
    try {
        const { accountData: { email, login }, _id } = req.user!
        res.status(HTTP_STATUSES.OKK_200).send({
            email,
            login,
            userId: _id
        })
    } catch (error) {
        console.error('meController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async newPassword (req: RequestWithBody<{ newPassword: string, recoveryCode: string }>, res: Response) {
    try {
        const newPasswordRes = await this.authService.changeNewPassword({
            newPassword: req.body.newPassword,
            recoveryCode: req.body.recoveryCode
        })
        if (!newPasswordRes) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: [{ message: 'Wrong recoveryCode', field: "recoveryCode" }] })
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('newPasswordController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async passwordRecovery (req: RequestWithBody<{ email: string }>, res: Response)  {
    try {
        const { email } = req.body

        const emailResending = await this.authService.resendCodeForRecoveryPassword(email)

        if (!emailResending) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: [{ message: 'Wrong email', field: "email" }] })
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('passwordRecoveryController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async refreshToken ( req: Request, res: Response ) {
    const requestRefreshToken = req.cookies['refreshToken']

    try {
        const updatedSession = await this.securityService.updateSessionUser(requestRefreshToken)

        if (!updatedSession.data) {
            res.sendStatus(updatedSession.statusCode)
            return
        }

        const { accessToken, refreshToken } = updatedSession.data

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
            .header('Authorization', accessToken)
            .send({ accessToken })
    } catch (error) {
        console.log('refreshTokenController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async registrationConfirmation (req: RequestWithBody<{ code: string }>, res: Response) {
    try {
        const result = await this.authService.confirmEmail(req.body.code);

        if (result) {
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }

        return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: [{ message: 'Wrong code', field: "code" }] });
    } catch (error) {
        console.error('registrationConfirmationController', error);
        return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).json({ errorsMessages: [{ message: 'Internal server error' }] });
    }
  };

  public async registerUser (req: RequestWithBody<{
    login: string,
    password: string,
    email: string
  }>, res: Response) {
    try {
        const user = await this.authService.createUser(req.body.login, req.body.email, req.body.password)

        if (user) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return
        }

        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    } catch (error) {
        console.error('registrationController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async regestrationEmailResending (req: RequestWithBody<{ email: string }>, res: Response) {
    try {
        const { email } = req.body

        const emailResending = await this.authService.resendCode(email)

        if (!emailResending) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } catch (error) {
        console.error('registrationEmailResendingController', error)
    }
  }
}