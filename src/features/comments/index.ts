import { Router } from 'express'
import {getCommentsByIdController} from "./controllers/getCommentsByIdController";

export const commentsRouter = Router()

commentsRouter.get('/:id', getCommentsByIdController)