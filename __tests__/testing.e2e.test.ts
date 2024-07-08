import {req} from './test-helpers'
import {SETTINGS} from "../src/settings";

describe('/testing', () => {
    it ('empty array', async () => {
        await req.delete(SETTINGS.PATH.TESTING + '/all-data').expect(204)
    })
})