const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
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
            type: Schema.ObjectId,
            ref: 'Article'
        }
    ]
    // Created articles are array. So, Array form [] is need
})

module.exports = mongoose.model('User', User)