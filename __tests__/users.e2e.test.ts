import { UserDBType } from "../src/db/user-db-type"
import { UserInputModel, UserOutputType } from "../src/input-output-types/users-types"
import { SETTINGS } from "../src/settings"
import { HTTP_STATUSES } from "../src/utils"
import { codedAuth, userCreate, userCreate2, userCreate3 } from "./helpers/datasets"
import { req } from "./helpers/test-helpers"
import { usersTestManager } from "./utils/usersTestManager"

// TESTS DONE
// SHOULD GET EMPTY USERS ARRAY
// SHOULD CREATE USER WITH CORRECT INPUT DATA
// SHOULDN'T CREATE USER 401

describe('users endpoints', () => {
  beforeAll(async() => {
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`)
  })
  it ('should get empty users array', async () => {
    const usersRes = await usersTestManager.getAllUsers()

    expect(usersRes.allUsersRes.body.items.length).toEqual(0)
  })

  it ('should create user with correct input data', async () => {
    const createdUserBody: UserInputModel = userCreate

    const newUser = await usersTestManager.createUser(createdUserBody, true, HTTP_STATUSES.CREATED_201)

    const resUsers = await usersTestManager.getAllUsers(HTTP_STATUSES.OKK_200)
    
    expect(resUsers.allUsersRes.body.items.length).toEqual(1)
  })

  it ('shouldn\'t create user. Expect: 401', async () => {
    const createdUserBody: UserInputModel = userCreate

    await usersTestManager.createUser(createdUserBody, false, HTTP_STATUSES.UNAUTHORIZED_401)
  })
  
  it ('shouldn\'t create user. Expect: "message": "email should be unique"', async () => {
    const createdUserBody: UserInputModel = userCreate

    const res = await usersTestManager.createUser(createdUserBody, true, HTTP_STATUSES.BAD_REQUEST_400)

    expect(res.res.body.errorsMessages[0].message).toEqual('email should be unique')
  })
  
  it ('should delete user', async () => {
    const createdUserBody: UserInputModel = userCreate2

    const createdUser = await usersTestManager.createUser(createdUserBody, true, HTTP_STATUSES.CREATED_201)

    const deleteUser = await req.delete(`${SETTINGS.PATH.USERS}/${createdUser.createdEntity.id}`).set({ 'Authorization': 'Basic ' + codedAuth }).expect(HTTP_STATUSES.NO_CONTENT_204)

    const resUsers = await usersTestManager.getAllUsers(HTTP_STATUSES.OKK_200)
    
    expect(resUsers.allUsersRes.body.items.length).toEqual(1)
  })

  it ('should auth', async () => {
    const credentials = {
      loginOrEmail: userCreate3.login,
      password: userCreate3.password
    }

    const createdUser = await usersTestManager.createUser(userCreate3, true, HTTP_STATUSES.CREATED_201)

    const authRes = await req.post(`${SETTINGS.PATH.AUTH}/login`).set({ 'Authorization': 'Basic ' + codedAuth }).send(credentials).expect(HTTP_STATUSES.NO_CONTENT_204)
  })
})