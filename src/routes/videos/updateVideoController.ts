import { Request, Response } from 'express';
import { db } from '../../db/db';
import {Resolutions, UpdateVideoInputType} from "../../input-output-types/videos-types";
import {OutputErrorsType} from "../../input-output-types/output-errors-type";

const inputValidation = (video: UpdateVideoInputType) => {
    const errors: OutputErrorsType = {
        errorsMessages: []
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

    if (video.availableResolutions !== undefined) {
        if (!Array.isArray(video.availableResolutions) || video.availableResolutions.find(p => !Resolutions[p])) {
            errors.errorsMessages.push({
                message: 'Invalid availableResolutions', field: 'availableResolutions'
            });
        }
    }

    if (video?.canBeDownloaded !== undefined && typeof video?.canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push({
            message: 'error!!!', field: 'canBeDownloaded'
        })
    }

    if (video?.minAgeRestriction !== undefined) {
        if (typeof video?.minAgeRestriction !== 'number' || video?.minAgeRestriction < 1 || video?.minAgeRestriction > 18) {
            errors.errorsMessages.push({
                message: 'error!!!', field: 'minAgeRestriction'
            })
        }
    }

    if (video?.publicationDate !== undefined && typeof video?.publicationDate !== 'string') {
        errors.errorsMessages.push({
            message: 'error!!!', field: 'publicationDate'
        })
    }
    return errors
}

export const updateVideoController = (req: Request, res: Response) => {
    const videoId = +req?.params?.id

    const errors = inputValidation(req?.body)

    if (errors.errorsMessages.length) {
        res.status(400).json(errors)
        return
    }

    const videoIndex = db.videos.findIndex(v => v?.id === videoId)
    if (videoIndex !== -1) {
        const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;

        db.videos[videoIndex] = {
            ...db.videos[videoIndex],
            title: title !== undefined ? title : db.videos[videoIndex].title,
            author: author !== undefined ? author : db.videos[videoIndex].author,
            availableResolutions: availableResolutions !== undefined ? availableResolutions : db.videos[videoIndex].availableResolutions,
            canBeDownloaded: canBeDownloaded !== undefined ? canBeDownloaded : db.videos[videoIndex].canBeDownloaded,
            minAgeRestriction: minAgeRestriction !== undefined ? minAgeRestriction : db.videos[videoIndex].minAgeRestriction,
            publicationDate: publicationDate !== undefined ? publicationDate : db.videos[videoIndex].publicationDate
        }

        return res.sendStatus(204);
    } else {
        return res.sendStatus(404);
    }
};
