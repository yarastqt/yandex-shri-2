'use strict';

const { Schema } = require('mongoose');

const { normalizeTimeToUnix } = require('../../utils');

const LectureSchema = new Schema({
    name: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        trim: true
    },
    schools: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'School'
            }
        ],
        set(schools) {
            /**
             * Свойство prevSchools необходимо для валидации при обновлении
             */
            this.prevSchools = this.schools.map((school) => school.id);
            return schools;
        }
    },
    lecturers: {
        type: [String],
        trim: true
    },
    audience: {
        type: Schema.Types.ObjectId,
        ref: 'Audience',
        set(audience) {
            /**
             * Свойство prevAudience необходимо для валидации при обновлении
             */
            this.prevAudience = this.audience;
            return audience;
        }
    },
    startTime: {
        type: Number,
        set: normalizeTimeToUnix
    },
    endTime: {
        type: Number,
        set: normalizeTimeToUnix
    }
}, {
    versionKey: false
});

module.exports = LectureSchema;
