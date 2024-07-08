import { DBType } from '../src/db/db'
import { OutputVideoType, Resolutions } from '../src/input-output-types/videos-types'

export const video1: OutputVideoType = {
    id: Date.now() + Math.random(),
    title: 't' + Date.now() + Math.random(),
    author: 'a' + Date.now() + Math.random(),
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: [Resolutions.P240],
}

export const dataset1: DBType = {
    videos: [video1],
}

export const video2: OutputVideoType /*VideoDBType*/ = {
    id: 119,
    title: 't' + Date.now() + Math.random(),
    author: 'a' + Date.now() + Math.random(),
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: [Resolutions.P240],
}

export const dataset2: DBType = {
    videos: [video2]
}