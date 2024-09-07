import mongoose from 'mongoose'
import {SETTINGS} from "../settings";

export const mongoUrl = SETTINGS.MONGO_URI

export async function runDb() {
    try {
        await mongoose.connect(mongoUrl)
        console.log('Connected successfully to mongoDB server')
    } catch (error) {
        console.log("Can't connect to mongo server", error)
        await mongoose.disconnect()
    }
}