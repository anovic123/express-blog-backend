import { Request, Response, Router } from 'express'
import { db, setDB } from "../../db/db"

export const testingRouter = Router()

const testingController = {
    deleteAllData: (req: Request, res: Response) => {
        db.videos = []
        return res.status(204).send()
    }
}

testingRouter.delete('/all-data', testingController.deleteAllData)
