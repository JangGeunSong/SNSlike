import mongoose, { Schema, Document } from 'mongoose'
// const mongoose = require('mongoose');

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    profile_image: string,
    profile: string,
    created_articles: [Schema.Types.ObjectId],
    _doc: IUser
}

const User: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile_image: {
        type: String,
        required: false,
    },
    profile: {
        type: String,
        required: false,
    },
    created_articles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Article'
        }
    ]
    // Created articles are array. So, Array form [] is need
})

export default mongoose.model<IUser>('User', User)