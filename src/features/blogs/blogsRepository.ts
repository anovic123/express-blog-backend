import {BlogDbType} from '../../db/blog-db-type'
import {db} from '../../db/db'
import {BlogInputModel, BlogViewModel} from '../../input-output-types/blogs-types'

export const blogsRepository = {
    create(blog: BlogInputModel) {
        const newBlog: BlogDbType = {
            id: new Date().toISOString() + Math.random(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        }
        db.blogs = [...db.blogs, newBlog]
        return newBlog.id
    },
    find(id: string) {
        return db.blogs.find(b => b.id === id)
    },
    findAndMap(id: string) {
        const blog = this.find(id)! // ! используем этот метод если проверили существование
        return this.map(blog)
    },
    getAll() {
        return db.blogs
    },
    del(id: string) {
        const blogRemoveRes = db.blogs.filter(el => el.id !== id)

    return !!blogRemoveRes
    },
    put(blog: BlogInputModel, id: string) {
        const userBlog = this.find(id)
        if (userBlog) {
            const updatedBlog = {
                ...userBlog,
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
            }
            console.log(updatedBlog)
            db.blogs = db.blogs.map(el => {
                if (el.id === updatedBlog.id) {
                    return updatedBlog
                }
                return el
            })

            return true
        } else {
            return false
        }
    },
    map(blog: BlogDbType) {
        const blogForOutput: BlogViewModel = {
            id: blog.id,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
        }
        return blogForOutput
    },
}