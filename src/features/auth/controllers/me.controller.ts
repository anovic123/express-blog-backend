import { Response } from 'express'

import {RequestAuthModel} from "../../../types/common";

import {HTTP_STATUSES} from "../../../utils";

export const meController = async (req: RequestAuthModel, res: Response) => {
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