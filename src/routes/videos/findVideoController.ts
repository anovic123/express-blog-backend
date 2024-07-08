import { Request, Response } from 'express'
import {db} from "../../db/db";

export const findVideoController = (req: Request, res: Response) => {
    const video = db.videos.find(v => v?.id === +req?.params?.id)

    if (!video || !req.params.id) {
        res.sendStatus(404)
        return
    }

    return res.status(200).send(video)
}