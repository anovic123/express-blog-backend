"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.commentsCollection = exports.usersCollection = exports.postsCollection = exports.blogsCollection = void 0;
const mongodb_1 = require("mongodb");
const url = 'mongodb+srv://vkanaev220:Q2tgZaS1r9EQIx2i@api-v1.otqbeom.mongodb.net/?retryWrites=true&w=majority&appName=api-v1';
if (!url) {
    throw new Error("MongoDB URL is missing");
}
const client = new mongodb_1.MongoClient(url);
const dbApi = client.db('api');
exports.blogsCollection = dbApi.collection('blogs');
exports.postsCollection = dbApi.collection('posts');
exports.usersCollection = dbApi.collection('users');
exports.commentsCollection = dbApi.collection('comments');
const runDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log('connected to db');
        return true;
    }
    catch (e) {
        console.log(e);
        yield client.close();
        return false;
    }
});
exports.runDb = runDb;
