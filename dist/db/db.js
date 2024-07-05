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
exports.runDb = exports.postsCollection = exports.blogsCollection = void 0;
const settings_1 = require("../settings");
const mongodb_1 = require("mongodb");
const url = settings_1.SETTINGS.MONGO_URI;
if (!url) {
    throw new Error("MongoDB URL is missing");
}
const client = new mongodb_1.MongoClient(url);
const dbApi = client.db('api');
exports.blogsCollection = dbApi.collection('blogs');
exports.postsCollection = dbApi.collection('posts');
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
// export type DBType = {
//     blogs: BlogDbType[]
//     posts: PostDbType[]
// }
// export type ReadonlyDBType = {
//     blogs: Readonly<BlogDbType[]>
//     posts: Readonly<PostDbType[]>
//     // some: any[]
// }
//
// export const db: DBType = {
//     blogs: [],
//     posts: [],
//     // some: []
// }
//
//
// export const setDB = (dataset?: Partial<ReadonlyDBType>) => {
//     if (!dataset) {
//         db.blogs = []
//         db.posts = []
//         // db.some = []
//         return
//     }
//
//     db.blogs = dataset.blogs?.map(b => ({...b})) || db.blogs
//     db.posts = dataset.posts?.map(p => ({...p})) || db.posts
// }
