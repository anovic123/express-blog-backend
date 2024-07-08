import {req} from './test-helpers'
import {setDB} from '../src/db/db'
import {SETTINGS} from "../src/settings";
import {dataset1, dataset2} from "./datasets";
import {InputVideoType, Resolutions} from "../src/input-output-types/videos-types";

describe('/videos', () => {
    it ('should got empty array', async () => {
        setDB()

        const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200)

        expect(res.body.length).toEqual(0)
    })

    it ('should get not empty array', async () => {
        setDB(dataset1)

        const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200)

        expect(res.body.length).toBe(1)
        expect(res.body[0]).toEqual(dataset1.videos[0])
    })

    it ('should create', async () => {
        setDB()

        const newVideo: InputVideoType = {
            title: 't1',
            author: 'a1',
            availableResolutions: [Resolutions.P144]
        }

        const res = await req.post(SETTINGS.PATH.VIDEOS).send(newVideo).expect(201)

        expect(res.body.availableResolutions).toEqual(newVideo.availableResolutions)
    })

    it ('shouldn\'t create', async () => {
        setDB(dataset1)

        const res = await req.get(SETTINGS.PATH.VIDEOS + '/1').expect(404)
    })

    it ('should delete', async () => {
        setDB(dataset2)

        const res = await req.delete(SETTINGS.PATH.VIDEOS + '/119').expect(204)
    })

    it ('sholdn\'t delete', async () => {
        setDB(dataset2)

        const res = await req.delete(SETTINGS.PATH.VIDEOS + '/1193').expect(404)
    })

})