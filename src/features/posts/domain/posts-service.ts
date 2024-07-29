import {PostInputModel, PostViewModel} from "../../../input-output-types/posts-types";
import {blogsRepository} from "../../blogs/blogsRepository";
import {PostDbType} from "../../../db/post-db-type";
import {ObjectId} from "mongodb";
import {postsRepository} from "../postsRepository";
import {UserDBType} from "../../../db/user-db-type";
import {CommentDBType} from "../../../db/comment-db-type";
import {CommentViewModel} from "../../../input-output-types/comment-types";
import {commentsQueryRepository} from "../../comments/commentsQueryRepository";

export const postsService = {
    async createPost(post: PostInputModel): Promise<PostDbType['id'] | null> {
        const blogName = await blogsRepository.findBlog(post.blogId)
        if (!blogName) return null
        const newPost: PostDbType = {
            id: new ObjectId().toString(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blogName.name,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const createdPost = await postsRepository.createPost(newPost)

        return newPost.id
    },
    async createPostComment(postId: string, content: string, user: UserDBType): Promise<CommentViewModel> {
        const newComment = {
            id: new ObjectId().toString(),
            content: content,
            commentatorInfo: {
                userId: new ObjectId(user.id).toString(),
                userLogin: user.login
            },
            postId,
            createdAt: new Date().toISOString()
        }
        const createdComment = await postsRepository.createPostComment(newComment)
        return commentsQueryRepository.mapPostCommentsOutput(newComment)
    },
    async delPostById (id: PostDbType['id']): Promise<boolean> {
        return await postsRepository.del(id)
    },
    async putPostById( body: PostInputModel, id: PostDbType['id']): Promise<boolean | null> {
        return await postsRepository.put(body, id)
    }
}