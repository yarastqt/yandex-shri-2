'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const SchoolSchema = require('./schema');
const { runValidatorsPlugin } = require('../../services/mongoose/plugins');
const { positiveNumberValidator } = require('../../services/mongoose/validators');

/**
 * Validations
 */
SchoolSchema.path('name')
    .required(true, 'Укажите название школы');
SchoolSchema.path('studentsCount')
    .validate(positiveNumberValidator, 'Значение должно быть положительным числом');

/**
 * Set json output
 */
SchoolSchema.set('toJSON', {
    transform(doc, json) {
        json.id = json._id;
        delete json._id;
    }
});

SchoolSchema.plugin(runValidatorsPlugin);
SchoolSchema.plugin(uniqueValidator, { message: 'Школа с таким названием уже существует' });

module.exports = mongoose.model('School', SchoolSchema);
