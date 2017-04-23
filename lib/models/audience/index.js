'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const AudienceSchema = require('./schema');
const { runValidatorsPlugin } = require('../../services/mongoose/plugins');
const { positiveNumberValidator } = require('../../services/mongoose/validators');

/**
 * Validations
 */
AudienceSchema.path('name')
    .required(true, 'Укажите название аудитории');
AudienceSchema.path('location')
    .required(true, 'Укажите местонахождение аудитории');
AudienceSchema.path('capacity')
    .validate(positiveNumberValidator, 'Значение должно быть положительным числом');

/**
 * Set json output
 */
AudienceSchema.set('toJSON', {
    transform(doc, json) {
        json.id = json._id;
        delete json._id;
    }
});

AudienceSchema.plugin(runValidatorsPlugin);
AudienceSchema.plugin(uniqueValidator, { message: 'Аудитория с таким названием уже существует' });

module.exports = mongoose.model('Audience', AudienceSchema);
