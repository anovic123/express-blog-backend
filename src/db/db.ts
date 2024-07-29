import {MongoClient} from "mongodb";

import {BlogDbType} from './blog-db-type'
import {PostDbType} from './post-db-type'
import {UserAccountDBType, UserDBType} from './user-db-type';
import {CommentDBType} from "./comment-db-type";

const url = 'mongodb+srv://vkanaev220:Q2tgZaS1r9EQIx2i@api-v1.otqbeom.mongodb.net/?retryWrites=true&w=majority&appName=api-v1'
if (!url) {
    throw new Error("MongoDB URL is missing")
}
const client = new MongoClient(url);
const dbApi = client.db('api')
export const blogsCollection = dbApi.collection<BlogDbType>('blogs')
export const postsCollection = dbApi.collection<PostDbType>('posts')
export const usersCollection = dbApi.collection<UserAccountDBType>('users')
export const commentsCollection = dbApi.collection<CommentDBType>('comments')

export const runDb = async (): Promise<boolean> => {
    try {
        await client.connect()
        console.log('connected to db')
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}