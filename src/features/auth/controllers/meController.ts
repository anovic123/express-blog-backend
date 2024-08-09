import { Response } from 'express'
import {RequestAuthModel} from "../../../types/common";
import {HTTP_STATUSES} from "../../../utils";

export const meController = async (req: RequestAuthModel, res: Response) => {
  const { accountData: { email, login }, _id } = req.user!
  return res.status(HTTP_STATUSES.OKK_200).send({
    email,
    login,
    id: _id
  })
}