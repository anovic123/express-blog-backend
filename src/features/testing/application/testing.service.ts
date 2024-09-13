import "reflect-metadata"
import { inject, injectable } from "inversify";

import { UsersRepository } from "../../users/infra/users.repository";
import { BlogsRepository } from "../../blogs/infra/blogs.repository";
import { PostsRepository } from "../../posts/infra/posts.repository";
import { CommentsRepository } from "../../comments/infra/comments.repository";
import { RateLimitRepository } from "../../../core/infra/rate-limit.repository";
import { SecurityRepository } from "../../security/infra/security.repository";

@injectable()
export class TestingService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(RateLimitRepository) protected rateLimitRepository: RateLimitRepository,
        @inject(SecurityRepository) protected securityRepository: SecurityRepository
    ) {}
    public async clearAllDB(): Promise<boolean> {
        try {
            await Promise.all([
                this.blogsRepository.deleteAll(),
                this.postsRepository.deleteAll(),
                this.usersRepository.deleteAll(),
                this.commentsRepository.deleteAll(),
                this.commentsRepository.deleteAll(),
                this.rateLimitRepository.deleteAll(),
                this.securityRepository.deleteAll(),
                this.postsRepository.removeAllPostsLikes()
            ]);
            return true;
        } catch (error) {
            console.error("Error clearing databases:", error);
            return false;
        }
    }
}

