import { Request, Response, Router } from 'express'

import { db } from '../../db/db'

import { createVideoController } from "./createVideoController";
import { findVideoController } from "./findVideoController";
import { deleteVideoController } from './deleteVideoController'
import { updateVideoController } from "./updateVideoController";

export const videosRouter = Router()

const videoController = {
   getVideosController: (req: Request, res: Response) => {
       const videos = db.videos

       return res.status(200).send(videos)
   },
    createVideoController,
    findVideoController,
    updateVideoController,
    deleteVideoController,
}

videosRouter.get('/', videoController.getVideosController)
videosRouter.post('/', videoController.createVideoController)
videosRouter.get('/:id', videoController.findVideoController)
videosRouter.put('/:id', videoController.updateVideoController)
videosRouter.delete('/:id', videoController.deleteVideoController)
