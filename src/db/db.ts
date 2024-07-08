import {OutputVideoType} from "../input-output-types/videos-types";

export type DBType = {
    videos: OutputVideoType[]
}

export const db: DBType = {
    videos: []
}

export const setDB = (dataset?: DBType) => {
    if (!dataset) {
        db.videos = []
        return
    }

    db.videos = dataset.videos || db.videos
}