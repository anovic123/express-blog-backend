import { BlogInputModel } from "../../src/types/blogs-types";
import { SETTINGS } from "../../src/settings";
import { HTTP_STATUSES, HttpStatusType } from "../../src/utils";
import {codedAuth, postCreate} from "../helpers/datasets";
import { req } from "../helpers/test-helpers";

export const blogsTestManager = {
  async createBlog(data: BlogInputModel, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
    const res = await req.post(SETTINGS.PATH.BLOGS).set({'Authorization': 'Basic ' + codedAuth}).send(data).expect(expectedStatusCode)

    let createdEntity

    if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
      createdEntity = res.body

      expect(createdEntity).toEqual({
        id: expect.any(String),
        name: data.name,
        description: data.description,
        websiteUrl: data.websiteUrl,
        createdAt: expect.any(String),
        isMembership: expect.any(Boolean)
      })
    }

    return{ res, createdEntity }
  },
  async getAllBlogs(expectedStatusCode: HttpStatusType = HTTP_STATUSES.OKK_200) {
    const allBlogsRes = await req.get(SETTINGS.PATH.BLOGS).expect(expectedStatusCode)

    return { allBlogsRes }
  },
  async getAllPostByBlogsId (blogId: string, expectedStatusCode: HttpStatusType = HTTP_STATUSES.OKK_200) {
    const res=  await req.get(`${SETTINGS.PATH.BLOGS}/${blogId}${SETTINGS.PATH.POSTS}`).expect(expectedStatusCode)

    return res
  },
  async createPostByBlogsId (blogId: string, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
    const res = await req.post(`${SETTINGS.PATH.BLOGS}/${blogId}${SETTINGS.PATH.POSTS}`).set({'Authorization': 'Basic ' + codedAuth}).send(postCreate).expect(expectedStatusCode)

    let createdEntity

    if (createdEntity === HTTP_STATUSES.CREATED_201) {
      createdEntity = res.body

      expect(createdEntity).toEqual({
        id: expect.any(String),
        title: createdEntity.title,
        shortDescription: createdEntity.shortDescription,
        content: createdEntity.content,
        blogId: createdEntity.blogId,
        blogName: createdEntity.blogName,
        createdAt: createdEntity.createdAt
      })
    }
    return { res, createdEntity }
  },
  async getBlogById (blogId: string, expectedStatusCode: HttpStatusType = HTTP_STATUSES.OKK_200) {
    const res = await req.get(`${SETTINGS.PATH.BLOGS}/${blogId}`).expect(expectedStatusCode)

    expect(res.body).toEqual({
      id: expect.any(String),
      name: res.body.name,
      description: res.body.description,
      websiteUrl: res.body.websiteUrl,
      createdAt: expect.any(String),
      isMembership: false
    })

    return res
  }
}