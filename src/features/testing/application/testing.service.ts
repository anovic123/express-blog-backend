import {rateLimitRepository} from "../../../core/infra/rate-limit.repository";
import {usersRepository} from "../../users/composition-root";
import {blogsRepository} from "../../blogs/composition-root";
import {commentsRepository} from "../../comments/composition-root";
import {postsRepository} from "../../posts/composition-root";
import {securityRepository} from "../../security/composition-root";

export class TestingService {
    public async clearAllDB(): Promise<boolean> {
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

export const testingService = new TestingService()
