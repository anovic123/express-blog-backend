import { SETTINGS } from "../../src/settings"
import { HTTP_STATUSES } from "../../src/utils"
import { codedAuth } from "./helpers/datasets"
import { req } from "./helpers/test-helpers"

// TEST DONE
// SHOULD DELETE ALL
// BLOGS SHOULD BE EMPTY
// POST SHOULD BE EMPTY ARRAY
// USERS SHOULD BE EMPTY

describe('testing', () => {

  it ('should delete all', async () => {
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`).expect(HTTP_STATUSES.NO_CONTENT_204)
  })

  it ('blogs should be empty array', async () => {
    const blogsRes = await req.get(SETTINGS.PATH.BLOGS).expect(HTTP_STATUSES.OKK_200)

    expect(blogsRes.body.items.length).toEqual(0)
  })

  it ('post should be empty array', async () => {
    const postsRes = await req.get(SETTINGS.PATH.POSTS).expect(HTTP_STATUSES.OKK_200)

    expect(postsRes.body.items.length).toEqual(0)
  })

  it ('users should be empty', async () => {
    const usersRes = await req.get(SETTINGS.PATH.USERS).set({'Authorization': 'Basic ' + codedAuth}).expect(HTTP_STATUSES.OKK_200)

    expect(usersRes.body.items.length).toEqual(0)
  })
})