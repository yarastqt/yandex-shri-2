'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const LectureSchema = require('./schema');
const staticsMethods = require('./statics');
const { normalizeTimeFromUnix } = require('../../utils');
const { runValidatorsPlugin, autoPopulatePlugin } = require('../../services/mongoose/plugins');
const {
    schoolsTimeValidator,
    existsSchoolsValidator,
    existsAudienceValidator,
    audienceCapacityValidator,
    audienceTimeValidator,
    timeValidator
} = require('./validators');

/**
 * Validations
 */
LectureSchema.path('name')
    .required(true, 'Укажите название лекции');
LectureSchema.path('schools')
    .required(true, 'Укажите ID школы')
    .validate(schoolsTimeValidator, 'У этой школы, в данное время уже назначена лекция')
    .validate(existsSchoolsValidator, 'Школа с таким ID неизвестна');
LectureSchema.path('lecturers')
    .required(true, 'Укажите лектора');
LectureSchema.path('audience')
    .required(true, 'Укажите ID аудитории')
    .validate(existsAudienceValidator, 'Аудитория с таким ID неизвестна')
    .validate(audienceCapacityValidator, 'Вместимость аудитории меньше чем количество студентов')
    .validate(audienceTimeValidator, 'В этой аудитории, в данное время уже назначена лекция');
LectureSchema.path('startTime')
    .required(true, 'Укажите начало лекции')
    .validate(timeValidator, 'Начало лекции должно быть раньше, чем конец');
LectureSchema.path('endTime')
    .required(true, 'Укажите конец лекции')
    .validate(timeValidator, 'Конец лекции должен быть позднее, чем начало');

/**
 * Statics
 */
LectureSchema.statics = staticsMethods;

/**
 * Set json output
 */
LectureSchema.set('toJSON', {
    transform(doc, json) {
        json.startTime = normalizeTimeFromUnix(json.startTime);
        json.endTime = normalizeTimeFromUnix(json.endTime);
        json.id = json._id;
        delete json._id;
    }
});

LectureSchema.plugin(runValidatorsPlugin);
LectureSchema.plugin(autoPopulatePlugin, { populating: 'schools audience', fields: 'name' });
LectureSchema.plugin(uniqueValidator, { message: 'Лекция с таким названием уже существует' });

module.exports = mongoose.model('Lecture', LectureSchema);
