import mongoose, {Schema, Document} from 'mongoose'
// const mongoose = require('mongoose');

export interface IArticle extends Document {
    title: string,
    writer: string,
    date: Date,
    description: string,
    images: [string],
    _doc: IArticle,
} 

const Article: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        // writer is object. I choose writer is the use on this page so, ref is 'User'
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: false,
        }
    ],
})

export default mongoose.model<IArticle>('Article', Article)