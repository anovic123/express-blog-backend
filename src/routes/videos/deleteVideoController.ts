import { Request, Response } from 'express'
import {db} from "../../db/db";

export const deleteVideoController = (req: Request, res: Response) => {
    for (let i = 0; i < db.videos.length; i++) {
        if (db.videos[i].id === +req.params.id) {
            db.videos.splice(i, 1);
            res.sendStatus(204)
            return
        }
    }

    res.sendStatus(404)
}