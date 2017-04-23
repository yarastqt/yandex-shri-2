'use strict';

const { Schema } = require('mongoose');

const SchoolSchema = new Schema({
    name: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        trim: true
    },
    studentsCount: {
        type: Number,
        default: 0,
        set: Math.floor
    }
}, {
    versionKey: false
});

module.exports = SchoolSchema;
