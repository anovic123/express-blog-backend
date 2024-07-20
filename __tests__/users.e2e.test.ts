import { UserDBType } from "../src/db/user-db-type"
import { UserInputModel, UserOutputType } from "../src/input-output-types/users-types"
import { HTTP_STATUSES } from "../src/utils"
import { userCreate } from "./helpers/datasets"
import { usersTestManager } from "./utils/usersTestManager"

// TESTS DONE
// SHOULD GET EMPTY USERS ARRAY
// SHOULD CREATE USER WITH CORRECT INPUT DATA
// SHOULDN'T CREATE USER 401

describe('users endpoints', () => {

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
})