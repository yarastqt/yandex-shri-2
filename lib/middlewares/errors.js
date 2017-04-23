'use strict';

function notFoundHandler(requeset, response, next) {
    response.status(404).json({
        code: 404,
        message: 'Not Found'
    });

    next();
}

function errorHandler(error, request, response, next) {
    response.status(500).json({
        code: 500,
        message: 'Internal Server Error'
    });

    next();
}

module.exports = {
    notFoundHandler,
    errorHandler
};
