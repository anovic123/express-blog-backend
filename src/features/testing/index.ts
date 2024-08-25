import { Router } from 'express'

import {deleteAllDataController} from "./controllers/deleta-all-data.controller";

export const testingRouter = Router({})

testingRouter.delete('/all-data', deleteAllDataController)