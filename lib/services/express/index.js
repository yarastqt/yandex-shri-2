'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const config = require('../../config');
const { notFoundHandler, errorHandler } = require('../../middlewares');

function expressService({ APIRoutes, webRoutes }) {
    const app = express();
    const port = config.get('PORT') || config.get('server:port');

    app.disable('x-powered-by');
    app.set('port', port);

    if (config.get('NODE_ENV') === 'development') {
        app.use(logger('dev'));
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    if (APIRoutes) {
        app.use('/api/v1', APIRoutes);
    }

    if (webRoutes) {
        app.use(webRoutes);
    }

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}

module.exports = expressService;
