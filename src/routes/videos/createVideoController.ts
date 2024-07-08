import { Request, Response } from 'express'
import { InputVideoType, OutputVideoType, Resolutions } from "../../input-output-types/videos-types";
import { OutputErrorsType } from "../../input-output-types/output-errors-type";
import { db } from "../../db/db";

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const inputValidation = (video: InputVideoType) => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    }

    if (!Array.isArray(video.availableResolutions) || video.availableResolutions.find(p => !Resolutions[p])) {
        errors.errorsMessages.push({
            message: 'error!!!', field: 'availableResolutions'
        })
    }

    if (!video?.title || video?.title.length > 40) {
        errors.errorsMessages.push({
            message: 'error!!!', field: 'title'
        })
    }

    if (!video?.author || video?.author.length > 20) {
        errors.errorsMessages.push({
            message: 'error!!!', field: 'author'
        })
    }

    return errors
}

export const createVideoController = (req: Request<any, any, InputVideoType>, res: Response<any | OutputVideoType | OutputErrorsType>) => {
    const errors = inputValidation(req?.body)

    if (errors.errorsMessages.length) {
        res.status(400).json(errors)
        return
    }

    const createdAt = new Date().toISOString();
    const publicationDate = addDays(new Date(createdAt), 1).toISOString();

    const newVideo: OutputVideoType = {
        id: Date.now() + Math.random(),
        title: req?.body?.title,
        author: req?.body?.author,
        availableResolutions: req?.body?.availableResolutions ?? [],
        createdAt: createdAt,
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: publicationDate
    }

    db.videos = [...db?.videos, newVideo]

    res.status(201).json(newVideo)
}
