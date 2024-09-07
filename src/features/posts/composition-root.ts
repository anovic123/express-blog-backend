import {PostsRepository} from "./infra/posts.repository";
import {PostsQueryRepository} from "./infra/posts-query.repository";
import {PostsService} from "./application/posts.service";

export const postsRepository = new PostsRepository()
export const postsQueryRepository = new PostsQueryRepository()

export const postsService = new PostsService(postsRepository, postsQueryRepository)