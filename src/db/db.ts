import {BlogDbType} from './blog-db-type'
import {PostDbType} from './post-db-type'
import {SETTINGS} from "../settings";
import {MongoClient} from "mongodb";

const url = SETTINGS.MONGO_URI
if (!url) {
    throw new Error("MongoDB URL is missing")
}
const client = new MongoClient(url);
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