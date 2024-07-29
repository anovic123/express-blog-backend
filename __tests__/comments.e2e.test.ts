import {ObjectId} from "mongodb";

import {req} from "./helpers/test-helpers";

import {SETTINGS} from "../src/settings";

import {commentsTestManager} from "./utils/commentsTestManager";
import {HTTP_STATUSES} from "../src/utils";

// TEST DONE

describe('comments endpoint', () => {
    beforeAll(async () => {
        await req.delete(`${SETTINGS.PATH.TESTING}/all-data`)
    })

    it ('should get 404', async () => {
        const res = await commentsTestManager.getAllComments(new ObjectId(), HTTP_STATUSES.NOT_FOUND_404)
    })
})