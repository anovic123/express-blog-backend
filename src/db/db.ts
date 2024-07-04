import {BlogDbType} from './blog-db-type'
import {PostDbType} from './post-db-type'
import {SETTINGS} from "../settings";
import {MongoClient, ServerApiVersion} from "mongodb";

const client = new MongoClient("mongodb+srv://vkanaev220:Q2tgZaS1r9EQIx2i@api-v1.otqbeom.mongodb.net/?retryWrites=true&w=majority&appName=api-v1");
const dbApi = client.db('api')
export const blogsCollection = dbApi.collection<BlogDbType>('blogs')
export const postsCollection = dbApi.collection<PostDbType>('posts')

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