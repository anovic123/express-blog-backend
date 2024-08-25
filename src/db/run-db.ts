import mongoose from 'mongoose'

export const mongoUrl = 'mongodb+srv://vkanaev220:Q2tgZaS1r9EQIx2i@api-v1.otqbeom.mongodb.net/?retryWrites=true&w=majority&appName=api-v1'

export async function runDb() {
    try {
        await mongoose.connect(mongoUrl)
        console.log('Connected successfully to mongoDB server')
    } catch (error) {
        console.log("Can't connect to mongo server", error)
        await mongoose.disconnect()
    }
}