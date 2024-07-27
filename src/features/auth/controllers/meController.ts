import { Response } from 'express'
import {RequestAuthModel} from "../../../types";
import {HTTP_STATUSES} from "../../../utils";

export const meController = async (req: RequestAuthModel, res: Response) => {
  return res.status(HTTP_STATUSES.OKK_200).send(req.user)
}