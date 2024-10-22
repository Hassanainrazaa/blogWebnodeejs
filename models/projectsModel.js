const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    projectImage1: {
        type: String,
        required: true
    },
    projectImage2: {
        type: String,
        required: true
    },
    projectImage3: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, {timerstamps: true});

const project = model('project', projectSchema);

module.exports = project;