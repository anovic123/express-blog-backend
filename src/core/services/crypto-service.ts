import "reflect-metadata"
import { injectable } from "inversify";
import bcrypt from "bcrypt";

@injectable()
export class CryptoService {
    constructor() {}

    async generateSalt() {
        return bcrypt.genSalt(10);
    }
    async generateHash(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
    async compareHash(password: string, passwordHash: string) {
        return bcrypt.compare(password, passwordHash);
    }
}
