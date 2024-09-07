import bcrypt from "bcrypt";

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

export const cryptoService = new CryptoService()