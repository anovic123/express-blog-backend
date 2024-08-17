import {BlogInputModel, BlogPostViewModel, BlogViewModel} from "../../src/types/blogs-types"

import { SETTINGS } from "../../src/settings"

import { HTTP_STATUSES } from "../../src/utils"

import { blog1, codedAuth } from "./helpers/datasets"

import { req } from "./helpers/test-helpers"

import { blogsTestManager } from "./utils/blogsTestManager"
import {ObjectId} from "mongodb";

// TEST DONE:
// RETURN BLOGS WITH PAGING. api/blogs
// CREATE NEW BLOG. api/blogs

// RETURNS ALL POSTS FOR SPECIFIED BLOG. blogs/{blogId}/posts
// CREATE NEW POST FOR SPECIFIC BLOG. /blogs/{blogId}/posts

// RETURNS BLOG BY ID. api/blogs/{id}
// UPDATE EXISTING BLOG BY ID WITH INPUT MODEL. api/blogs/{id}
// SHOULD DELETE BLOG BY ID. api/blogs/{id}

describe('blogs endpoint', () => {
  beforeAll(async () => {
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`)
  })

  let createdBlog1: BlogViewModel | null = null
    console.log(createdBlog1)

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
    await req.get(`${SETTINGS.PATH.BLOGS}/${new ObjectId().toString()}`).expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it ('should del', async () => {
    await req.delete(`${SETTINGS.PATH.BLOGS}/${createdBlog1?.id}`).set({'Authorization': 'Basic ' + codedAuth}).expect(HTTP_STATUSES.NO_CONTENT_204)

    await req.get(`${SETTINGS.PATH.BLOGS}/${createdBlog1?.id}`).expect(HTTP_STATUSES.NO_CONTENT_204)
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

  it ('should returns 404 posts for specified blog', async () => {
      const res = await blogsTestManager.getAllPostByBlogsId(createdBlog1!.id, HTTP_STATUSES.NOT_FOUND_404)
  })

  let newPost: BlogPostViewModel | null

  it ('should create new post for specific blog', async () => {
     const createPostRes = await blogsTestManager.createPostByBlogsId(createdBlog2!.id)

      newPost = createPostRes.createdEntity

      const postsByBlogsIdRes = await blogsTestManager.getAllPostByBlogsId(createdBlog2!.id)

      expect(postsByBlogsIdRes.body.items.length).toEqual(1)
  })

  it ('should get blog by id', async () => {
    await blogsTestManager.getBlogById(createdBlog2!.id)
  })

  it ('should update blog', async () => {
      const updatedBlogRes = await req.put(`${SETTINGS.PATH.BLOGS}/${createdBlog2!.id}`).set('Authorization', 'Basic ' + codedAuth).send({
          name: createdBlog2!.name,
          description: 'updated description',
          websiteUrl: createdBlog2!.websiteUrl,
      }).expect(HTTP_STATUSES.NO_CONTENT_204)

      const updatedBlogByIdRes = await blogsTestManager.getBlogById(createdBlog2!.id)

      expect(updatedBlogByIdRes.body).toEqual({
          id: expect.any(String),
          name: updatedBlogByIdRes.body.name,
          description: 'updated description',
          websiteUrl: updatedBlogByIdRes.body.websiteUrl,
          createdAt: expect.any(String),
          isMembership: false
      })
  })
})