import { req } from './test-helpers'
import {setDB} from "../src/db/db";
import {SETTINGS} from "../src/settings";

describe('/videos', () => {
    beforeAll(async () => {
        setDB()
    })

    it('save', async () => {
        setDB()

        const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200)

        console.log(res.status)
        console.log(res.body)

        expect(1).toBe(1)
    })
})