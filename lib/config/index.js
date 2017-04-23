'use strict';

const path = require('path');
const nconf = require('nconf');

const config = nconf.argv().env();
const env = config.get('NODE_ENV');

if (env === 'development') {
    config.file('global', path.join(__dirname, 'config.dev.json'));
} else if (env === 'test') {
    config.file('global', path.join(__dirname, 'config.test.json'));
} else if (env === 'production') {
    config.file('global', path.join(__dirname, 'config.prod.json'));
}

module.exports = config;
