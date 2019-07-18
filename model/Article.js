const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Article = new Schema({
    title: {
        type: String,
        required: true,
    },
    writer: {
        type: Schema.ObjectId,
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
})

module.exports = mongoose.model('Article', Article)