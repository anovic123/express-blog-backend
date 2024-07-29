import { BlogDbType } from "../../src/db/blog-db-type";
import { PostInputModel } from "../../src/input-output-types/posts-types";
import { SETTINGS } from "../../src/settings";
import { HTTP_STATUSES, HttpStatusType } from "../../src/utils";
import { codedAuth } from "../helpers/datasets";
import { req } from "../helpers/test-helpers";
import {BlogViewModel} from "../../src/input-output-types/blogs-types";
import {PostDbType} from "../../src/db/post-db-type";

export const postsTestManager = {
  async createPost(data: PostInputModel, blog: BlogDbType, withCredentials?: boolean, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
    let request = req.post(SETTINGS.PATH.POSTS).send(data).expect(expectedStatusCode)

    if (withCredentials) {
      request = request.set({ 'Authorization': 'Basic ' + codedAuth });
    }

    const res = await request

    let createdEntity

    if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
      createdEntity = res.body

      expect(createdEntity).toEqual({
        id: expect.any(String),
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: blog.id,
        blogName: blog.name,
        createdAt: expect.any(String)
      })
    }

    return { res, createdEntity }
  },
  async getAllPosts(expectedStatusCode: HttpStatusType = HTTP_STATUSES.OKK_200) {
    const allPostsRes = await req.get(SETTINGS.PATH.POSTS).expect(expectedStatusCode)
    
    return allPostsRes
  },
  async getPostById(id: string, expectedStatusCode: HttpStatusType = HTTP_STATUSES.OKK_200) {
    const postById = await req.get(`${SETTINGS.PATH.POSTS}/${id}`).expect(expectedStatusCode)
    if (expectedStatusCode === HTTP_STATUSES.OKK_200) {
      expect(postById.body).toEqual({
        id: postById.body?.id,
        title: postById.body.title,
        shortDescription: postById.body.shortDescription,
        content: postById.body.content,
        blogId: postById.body.blogId,
        blogName: postById.body.blogName,
        createdAt: postById.body.createdAt,
      })
    }
    return postById
  }
}