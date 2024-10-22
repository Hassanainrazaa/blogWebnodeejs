const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,

    },
    body: {
        type: String,
        required: true,

    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    coverImageURL: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timerstamps: true });

const blog = model("blog", blogSchema);
module.exports = blog;