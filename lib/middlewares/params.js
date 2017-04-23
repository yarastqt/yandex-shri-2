'use strict';

const { Types } = require('mongoose');

function validateParamID(paramName) {
    return (request, response, next) => {
        if (request.params[paramName]) {
            if (!Types.ObjectId.isValid(request.params[paramName])) {
                return response.status(400).json({
                    code: 400,
                    errors: [{
                        field: paramName,
                        message: 'Неверный параметр',
                        value: request.params[paramName]
                    }]
                });
            }
        }

        return next();
    };
}

module.exports = {
    validateParamID
};
