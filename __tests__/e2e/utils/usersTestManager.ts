import { SETTINGS } from "../../../src/settings";

import { UserInputModel } from "../../../src/types/users-types";

import { HTTP_STATUSES, HttpStatusType } from "../../../src/utils";

import { codedAuth } from "../helpers/datasets";
import { req } from "../helpers/test-helpers";

export const usersTestManager = {
  async createUser(data: UserInputModel, withCredentials?: boolean, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
    let request = req.post(SETTINGS.PATH.USERS).send(data).expect(expectedStatusCode);
    
    if (withCredentials) {
        request = request.set({ 'Authorization': 'Basic ' + codedAuth });
    }

    const res = await request;

    let createdEntity

    if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
      createdEntity = res.body

      expect(createdEntity).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        email: data.email,
        login: data.login
      })
    }
    
    return { res, createdEntity }
  },
  async getAllUsers(expectedStatusCode: HttpStatusType = HTTP_STATUSES.OKK_200) {
    const allUsersRes = await req.get(SETTINGS.PATH.USERS).set({'Authorization': 'Basic ' + codedAuth}).expect(expectedStatusCode)

    return { allUsersRes }
  }
}