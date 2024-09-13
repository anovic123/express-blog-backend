import { inject, injectable } from 'inversify'
import { Response, Request } from 'express'

import { SecurityService } from '../application/security.service';
import { JwtService } from '../../../core/services/jwt.service';

import { SecurityQueryRepository } from '../infra/sequrity-query.repository';

import { RequestAuthModel, RequestWithParams } from '../../../core/request-types';

import { HTTP_STATUSES } from '../../../utils';

@injectable()
export class SecurityController {
  constructor(@inject(SecurityService) protected securityService: SecurityService, @inject(JwtService) protected jwtService: JwtService,
@inject(SecurityQueryRepository) protected securityQueryRepository: SecurityQueryRepository) {}

  public async deleteAllOtherDevices (req: Request, res: Response) {
    try {
        const refreshToken = req.cookies['refreshToken']

        const refreshTokenData = await this.jwtService.getDataFromRefreshToken(refreshToken);

        if (!refreshTokenData) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        const { userId, deviceId } = refreshTokenData;

        const deleteResult = await this.securityService.deleteUserDeviceByIdAll(deviceId, userId);

        if (deleteResult) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }
    } catch (error) {
        console.error('deleteAllOtherDevicesController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async deleteDeviceById (req: RequestWithParams<{ deviceId: string }>, res: Response) {
    const deviceId = req.params.deviceId

    try {
        const refreshToken = req.cookies['refreshToken'];

        const refreshTokenData = await this.jwtService.getDataFromRefreshToken(refreshToken);

        if (!refreshTokenData) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        const userId = refreshTokenData.userId

        const checkDeviceUser = await this.securityQueryRepository.checkUserDeviceById(userId, deviceId)

        if (!checkDeviceUser) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN)
            return
        }

        await this.securityService.deleteUserDeviceById(deviceId)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }  catch (error) {
        console.error('deleteDeviceByIdController', error)
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
  }

  public async getDevices (req: RequestAuthModel, res: Response) {
    try {
        const resultData = await this.jwtService.getDataFromRefreshToken(req.cookies['refreshToken'])
        if (!resultData?.userId) {
            return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }
        const devices = await this.securityQueryRepository.getAllDevicesSessions(resultData?.userId)
        return res.status(HTTP_STATUSES.OKK_200).json(devices);
    } catch (error) {
        console.error('Error in getDevicesController:', error);
        return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }
};

}