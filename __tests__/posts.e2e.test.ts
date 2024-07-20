import { PostInputModel } from "../src/input-output-types/posts-types"
import { SETTINGS } from "../src/settings"
import { HTTP_STATUSES } from "../src/utils"
import { blog1, blog2, createString, postCreate } from "./helpers/datasets"
import { req } from "./helpers/test-helpers"
import { blogsTestManager } from "./utils/blogsTestManager"
import { postsTestManager } from "./utils/postsTestManager"

describe('posts endpoint', () => {
  beforeAll(async() => {
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`)
  })
    it ('should create post', async () => {
      const newBlog = await blogsTestManager.createBlog(blog1)

      const newPost: PostInputModel = {
        ...postCreate,
        blogId: newBlog.createdEntity.id
      }

      const newPostRes = await postsTestManager.createPost(newPost, newBlog.createdEntity, true)

      expect(newPostRes.createdEntity.title).toEqual(newPost.title)
      expect(newPostRes.createdEntity.shortDescription).toEqual(newPost.shortDescription)
      expect(newPostRes.createdEntity.content).toEqual(newPost.content)
      expect(newPostRes.createdEntity.blogId).toEqual(newBlog.createdEntity.id)
    })
    it ('shouldn\'t create post. 401', async () => {
      const newBlog = await blogsTestManager.createBlog(blog2)

      const newPost: PostInputModel = {
        ...postCreate,
        blogId: newBlog.createdEntity.id
      }

      await postsTestManager.createPost(newPost, newBlog.createdEntity, false, HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it ('shouldn\'t create post. Validation Issues', async () => {
      const newBlog = await blogsTestManager.createBlog(blog2)

      const newPost: PostInputModel = {
        title: createString(31),
        content: createString(1001),
        shortDescription: createString(101),
        blogId: newBlog.createdEntity.id
      }

      const newPostResponse = await postsTestManager.createPost(newPost, newBlog.createdEntity, true, HTTP_STATUSES.BAD_REQUEST_400)

      expect(newPostResponse.res.body.errorsMessages.length).toEqual(3)
      expect(newPostResponse.res.body.errorsMessages[0].field).toEqual('title')
      expect(newPostResponse.res.body.errorsMessages[1].field).toEqual('shortDescription')
      expect(newPostResponse.res.body.errorsMessages[2].field).toEqual('content')
    })
    it ('should get not empty array', async () => {
      const res = await postsTestManager.getAllPosts()

      expect(res.body.items.length).toEqual(1)
    })
})