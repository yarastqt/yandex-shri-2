'use strict';

const { notFoundHandler, errorHandler } = require('./errors');
const { validateParamID } = require('./params');

module.exports = {
    notFoundHandler,
    errorHandler,
    validateParamID
};
