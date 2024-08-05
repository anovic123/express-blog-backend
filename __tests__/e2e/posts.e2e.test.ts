import {PostInputModel} from "../../src/types/posts-types"
import { SETTINGS } from "../../src/settings"
import { HTTP_STATUSES } from "../../src/utils"
import {blog1, blog2, codedAuth, createString, postComment, postCreate, userCreate3} from "./helpers/datasets"
import { req } from "./helpers/test-helpers"
import { blogsTestManager } from "./utils/blogsTestManager"
import { postsTestManager } from "./utils/postsTestManager"
import {PostDbType} from "../../src/db/post-db-type";
import {usersTestManager} from "./utils/usersTestManager";

// TEST DONE

// SKIPPED
// RETURNS COMMENTS FOR SPECIFIED POST. /api/posts/{postId}/comments
// CREATE NEW COMMENT. /api/posts/{postId}/comments

// Create new post. api/posts
// Return all posts for specified blog. /api/posts/{id}
// UPDATE EXISTING POST BY ID WITH INPUT_MODEL. /api/posts/{id}
// DELETE POST SPECIFIED BY ID. /api/posts/{id}


describe('posts endpoint', () => {
    beforeAll(async() => {
      await req.delete(`${SETTINGS.PATH.TESTING}/all-data`)
    })

    let createdPost: PostDbType

    const credentials = {
        loginOrEmail: userCreate3.login,
        password: userCreate3.password
    }

    let userToken: string | null

    it ('should create post', async () => {
     const newBlog = await blogsTestManager.createBlog(blog1)

      const newPost: PostInputModel = {
        ...postCreate,
        blogId: newBlog.createdEntity.id
      }

      const newPostRes = await postsTestManager.createPost(newPost, newBlog.createdEntity, true)
      createdPost = newPostRes.createdEntity
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

    it ('should get post by id', async () => {
      await postsTestManager.getPostById(createdPost.id, HTTP_STATUSES.OKK_200)
    })

    it ('update existing post by id with input model', async () => {
        const updatePost = await req.put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`).set({ 'Authorization': 'Basic ' + codedAuth}).send({
            title: 'update title',
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdPost.blogId
        }).expect(HTTP_STATUSES.NO_CONTENT_204)

        const updatedPostByIdRes = await postsTestManager.getPostById(createdPost.id)

        expect(updatedPostByIdRes.body).toEqual({
            id: updatedPostByIdRes.body?.id,
            title: 'update title',
            shortDescription: updatedPostByIdRes.body.shortDescription,
            content: updatedPostByIdRes.body.content,
            blogId: updatedPostByIdRes.body.blogId,
            blogName: updatedPostByIdRes.body.blogName,
            createdAt: updatedPostByIdRes.body.createdAt,
        })
    })

    it ('delete post specified by id', async () => {
        const deletedRes = await req.delete(`${SETTINGS.PATH.POSTS}/${createdPost.id}`).set({ 'Authorization': 'Basic ' + codedAuth }).expect(HTTP_STATUSES.NO_CONTENT_204)

        const allPostsRes = await postsTestManager.getAllPosts()

        expect(allPostsRes.body.items.length).toEqual(0)
    })

    let createdPost2: PostDbType
    it ('should create post 2', async () => {
        const newBlog = await blogsTestManager.createBlog(blog1)

        const newPost: PostInputModel = {
            ...postCreate,
            blogId: newBlog.createdEntity.id
        }

        const newPostRes = await postsTestManager.createPost(newPost, newBlog.createdEntity, true)
        createdPost2 = newPostRes.createdEntity
        expect(newPostRes.createdEntity.title).toEqual(newPost.title)
        expect(newPostRes.createdEntity.shortDescription).toEqual(newPost.shortDescription)
        expect(newPostRes.createdEntity.content).toEqual(newPost.content)
        expect(newPostRes.createdEntity.blogId).toEqual(newBlog.createdEntity.id)
    })

    it ('should auth', async () => {

        const createdUser = await usersTestManager.createUser(userCreate3, true, HTTP_STATUSES.CREATED_201)

        const authRes = await req.post(`${SETTINGS.PATH.AUTH}/login`).send(credentials).expect(HTTP_STATUSES.OKK_200)
        userToken = authRes.body.accessToken
        expect(userToken).toEqual(expect.any(String))
    })

    it ('should create comment', async () => {
        const newComment = await postsTestManager.createPostComment(createdPost2!.id, postComment, userToken)
    })
})