import {securityRepository} from "../../security/infra/security.repository";
import {rateLimitRepository} from "../../security/infra/rate-limit.repository";
import {usersRepository} from "../../users/infra/users.repository";
import {blogsRepository} from "../../blogs/infra/blogs.repository";
import {postsRepository} from "../../posts/infra/posts.repository";
import {commentsRepository} from "../../comments/infra/comments.repository";

export const testingService = {
    async clearAllDB(): Promise<boolean> {
        try {
            await Promise.all([
                blogsRepository.deleteAll(),
                postsRepository.deleteAll(),
                usersRepository.deleteAll(),
                commentsRepository.deleteAll(),
                rateLimitRepository.deleteAll(),
                securityRepository.deleteAll()
            ]);
            return true;
        } catch (error) {
            console.error("Error clearing databases:", error);
            return false;
        }
    }
}
