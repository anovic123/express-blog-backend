import {fromUTF8ToBase64} from '../../src/global-middlewares/admin-middleware'
import {SETTINGS} from '../../src/settings'

export const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN)

export const createString = (length: number) => {
    let s = ''
    for (let x = 1; x <= length; x++) {
        s += x % 10
    }
    return s
}

export const blog1 = {
    name: 'length_201',
    description: 'dqweqweqweqweescription',
    websiteUrl: 'https://youtube.com',
} as const

export const blog2 = {
    name: 'length_201',
    description: 'dqweqweqweqweescription',
    websiteUrl: 'https://youtube.com',
} as const

export const userCreate = {
    login: 'user',
    password: 'asdadsd',
    email: 'vkanaev220@gmail.com'
} as const

export const userCreate2 = {
    login: 'user2',
    password: 'asdadsd',
    email: 'vkanaev2202@gmail.com'
} as const

export const userCreate3 = {
    login: 'user3',
    password: 'asdadsd',
    email: 'vkanaev2203@gmail.com'
} as const

export const postCreate = {
    title: 'Title',
    content: 'Content',
    shortDescription: 'Short Description',
} as const 


//========================================================================================================================================================

export const blog7 = {
    id: new Date().toISOString() + Math.random(),
    name: 'n7',
    description: 'd7',
    websiteUrl: 'http://some7.com',
} as const

export const post1 = {
    id: new Date().toISOString() + Math.random(),
    title: 't1',
    content: 'c1',
    shortDescription: 's1',
    blogName: 'n1'
} as const 

export const dataset1 = {
    blogs: [blog1],
    posts: [],
} as const
export const dataset2 = {
    blogs: [blog1, blog7],
    posts: [post1],
} as const
