import { inject, injectable } from 'inversify'
import { Response, Request } from 'express'

import { TestingService } from '../application/testing.service'

import { HTTP_STATUSES } from '../../../utils'


@injectable()
export class TestingController {
  constructor(@inject(TestingService) protected testingService: TestingService) {}

  async deleteAllData(req: Request, res: Response) {
    try {
      const deleteRes = await this.testingService.clearAllDB()

      if (!deleteRes) {
          res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
          return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  } catch (error) {
      console.error('deleteAllDataController', error)
      res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
  }
  }
}