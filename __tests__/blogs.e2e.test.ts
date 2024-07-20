import { BlogInputModel, BlogViewModel } from "../src/input-output-types/blogs-types"
import { SETTINGS } from "../src/settings"
import { HTTP_STATUSES } from "../src/utils"
import { blog1, codedAuth } from "./helpers/datasets"
import { req } from "./helpers/test-helpers"
import { blogsTestManager } from "./utils/blogsTestManager"

// TEST DONE:
// GET ALL
// GET BY ID
// SHOULDN'T FIND
// SHOULD DELETE
// SHOULDN'T DELETE

describe('blogs endpoint', () => {
  beforeAll(async () => {
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`)
  })

  let createdBlog1: BlogViewModel | null = null

  it ('should create blog with correct input data', async () => {
      const createdBlogBody: BlogInputModel = blog1

      const result = await blogsTestManager.createBlog(createdBlogBody, HTTP_STATUSES.CREATED_201)

      createdBlog1 = result.createdEntity

      const resBlogs = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OKK_200)

      expect(resBlogs.allBlogsRes.body.items).toEqual([createdBlog1])
  })

  it ('should get blog by id', async () => {
    await req.get(`${SETTINGS.PATH.BLOGS}/${createdBlog1!.id}`).expect(HTTP_STATUSES.OKK_200, createdBlog1)
  })

  it ('shouldn\'t find', async () => {
    await req.get(`${SETTINGS.PATH.BLOGS}/999999`).expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it ('should del', async () => {
    await req.delete(`${SETTINGS.PATH.BLOGS}/${createdBlog1?.id}`).set({'Authorization': 'Basic ' + codedAuth}).expect(HTTP_STATUSES.NO_CONTENT_204)

    await req.get(`${SETTINGS.PATH.BLOGS}/${createdBlog1?.id}`).expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  let createdBlog2: BlogViewModel | null = null

  it ('should create blog 2 with correct input data', async () => {
      const createdBlogBody: BlogInputModel = blog1

      const result = await blogsTestManager.createBlog(createdBlogBody, HTTP_STATUSES.CREATED_201)

      createdBlog2 = result.createdEntity

      const resBlogs = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OKK_200)

      expect(resBlogs.allBlogsRes.body.items).toEqual([createdBlog2])
  })

  it ('shouldn\'t delete. Expected 401', async () => {
    await req.delete(`${SETTINGS.PATH.BLOGS}/${createdBlog2!.id}`).expect(HTTP_STATUSES.UNAUTHORIZED_401)
  })
})