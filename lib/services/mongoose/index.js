'use strict';

const mongoose = require('mongoose');

const { log } = require('../../utils');
const config = require('../../config');

function mongooseService() {
    mongoose.Promise = Promise;
    mongoose.connect(config.get('mongoose:connectionURI'), config.get('mongoose:options')).then(() => {
        const { host, port } = mongoose.connection;

        if (['development', 'production'].includes(config.get('NODE_ENV'))) {
            log.green(`DataBase is running and listening on ${host}:${port}`);
        }
    }).catch((error) => {
        log.red(error);
        process.exit(-1);
    });

    return mongoose.connection;
}

module.exports = mongooseService;
