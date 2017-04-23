'use strict';

const { log } = require('./utils');
const config = require('./config');
const APIRoutes = require('./api');
const webRoutes = require('./web');
const { mongooseService, expressService } = require('./services');

// eslint-disable-next-line no-unused-vars
const connection = mongooseService();
const app = expressService({ APIRoutes, webRoutes });

app.listen(app.get('port'), () => {
    if (['development', 'production'].includes(config.get('NODE_ENV'))) {
        log.green(`Server is running and listening on http://localhost:${app.get('port')}`);
    }
});

module.exports = app;
