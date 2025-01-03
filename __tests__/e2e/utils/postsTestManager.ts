import {PostInputModel, PostViewModel} from "../../../src/types/posts-types";
import {BlogViewModel} from "../../../src/types/blogs-types";

import { HTTP_STATUSES, HttpStatusType } from "../../../src/utils";

import { SETTINGS } from "../../../src/settings";

import { codedAuth } from "../helpers/datasets";
import { req } from "../helpers/test-helpers";

export const postsTestManager = {
  async createPost(data: PostInputModel, blog: BlogViewModel, withCredentials?: boolean, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
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
  async getPostById(id: PostViewModel['id'], expectedStatusCode: HttpStatusType = HTTP_STATUSES.OKK_200) {
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
  },



  async createPostComment (postId: PostViewModel['id'], inputData: { content: string }, userToken: string | null, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
    let request = req.post(`${SETTINGS.PATH.POSTS}/${postId}${SETTINGS.PATH.COMMENTS}`).send(inputData).expect(expectedStatusCode)

    if (userToken) {
      request = request.set({ 'Authorization': 'Bearer ' + userToken });
    }

    const res = await request

    let createdEntity

    if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
      createdEntity = res.body

      expect(createdEntity).toEqual({
        id: expect.any(String),
        content: inputData.content,
        commentatorInfo: {
          userId: createdEntity.commentatorInfo.userId,
          userLogin: createdEntity.commentatorInfo.userLogin
        },
        createdEntity: expect.any(String)
      })
    }

    return { res, createdEntity }
  }
}