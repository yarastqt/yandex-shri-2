'use strict';

const { normalizeTimeFromUnix } = require('./date');

function normalizeCastError(error) {
    return {
        [error.path]: {
            path: error.path,
            value: error.value,
            message: error.message,
            name: error.name
        }
    };
}

function normalizeErrors(error) {
    if (error.name === 'CastError') {
        error.errors = normalizeCastError(error);
    }

    return Object.keys(error.errors).map((field) => {
        const fieldError = error.errors[field];
        const { name, path } = fieldError;
        let { message, value } = fieldError;

        /**
         * Так как в mongoose нет возможности задавать свои собственные сообщения
         * исклюичениям типа CastError, то приходится делать так
         */
        if (name === 'CastError') {
            if (['startTime', 'endTime'].includes(path)) {
                message = 'Неверный формат времени';
            }

            if (['studentsCount', 'capacity'].includes(path)) {
                message = 'Значение должно быть числом';
            }

            if (['audience', 'schools'].includes(path)) {
                message = 'Неверный параметр';
            }
        } else if (name === 'ValidatorError') {
            /**
             * Нормализуем дату для показа ошибки,
             * т.к. при запросе мы отправляем дату формата: MM-DD-YYYY HH:mm
             */
            if (['startTime', 'endTime'].includes(path) && value) {
                value = normalizeTimeFromUnix(value);
            }
        }

        if (value && value.toString().length) {
            return { field, message, value };
        }

        return { field, message };
    });
}

module.exports = {
    normalizeErrors
};
