import { BlogInputModel } from "../../src/input-output-types/blogs-types";
import { SETTINGS } from "../../src/settings";
import { HTTP_STATUSES, HttpStatusType } from "../../src/utils";
import { codedAuth } from "../helpers/datasets";
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
  } 
}