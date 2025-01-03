import {HTTP_STATUSES} from "../../src/utils";
import {SETTINGS} from "../../src/settings";

import {req} from "./helpers/test-helpers";
import { userCreate3 } from "./helpers/datasets";

import {usersTestManager} from "./utils/usersTestManager";

describe('auth endpoint', () => {
    beforeAll(async () => {
        await req.delete(`${SETTINGS.PATH.TESTING}/all-data`)
    })

    const credentials = {
        loginOrEmail: userCreate3.login,
        password: userCreate3.password
    }

    let userToken: string | null

    it ('should auth', async () => {

        const createdUser = await usersTestManager.createUser(userCreate3, true, HTTP_STATUSES.CREATED_201)

        const authRes = await req.post(`${SETTINGS.PATH.AUTH}/login`).send(credentials).expect(HTTP_STATUSES.OKK_200)
        userToken = authRes.body.accessToken
        expect(userToken).toEqual(expect.any(String))
    })

    it ('shouldn auth', async () => {
        const authRes = await req.post(`${SETTINGS.PATH.AUTH}/login`).send({
            loginOrEmail: userCreate3.login,
            password: 'Wrong password'
        }).expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it ('should get user', async () => {
        console.log("userToken:", userToken)
        const user = await req.get(`${SETTINGS.PATH.AUTH}/me`).set({ 'Authorization': `Bearer ${userToken}` }).expect(HTTP_STATUSES.OKK_200)

        expect(user.body.login).toEqual(credentials.loginOrEmail)
    })
})
