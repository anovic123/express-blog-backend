import {blogsRepository} from "../../blogs/blogs.repository";
import {postsRepository} from "../../posts/posts.repository";
import {usersRepository} from "../../users/users.repository";
import {commentsRepository} from "../../comments/comments.repository";
import {rateLimitRepository} from "../../security/application/rate-limit.repository";
import {securityRepository} from "../../security/application/security.repository";

export const testingService = {
    async clearAllDB(): Promise<boolean> {
        try {
            await Promise.all([
                blogsRepository.deleteAll(),
                postsRepository.deleteAll(),
                usersRepository.deleteAll(),
                commentsRepository.deleteAll(),
                rateLimitRepository.deleteAll(),
                securityRepository .deleteAll()
            ]);
            return true;
        } catch (error) {
            console.error("Error clearing databases:", error);
            return false;
        }
    }
}
