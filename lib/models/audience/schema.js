'use strict';

const { Schema } = require('mongoose');

const AudienceSchema = new Schema({
    name: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        trim: true
    },
    capacity: {
        type: Number,
        default: 0,
        set: Math.floor
    },
    location: {
        type: String,
        trim: true
    }
}, {
    versionKey: false
});

module.exports = AudienceSchema;
