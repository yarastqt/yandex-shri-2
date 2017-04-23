'use strict';

const moment = require('moment');

function normalizeTimeToUnix(value) {
    if (!value) {
        return '';
    }

    return moment(new Date(value)).unix();
}

function normalizeTimePlusOneDayToUnix(value) {
    return moment(new Date(value)).add(1, 'day').unix();
}

function normalizeTimeFromUnix(value) {
    return moment.unix(value).format('MM-DD-YYYY HH:mm');
}

module.exports = {
    normalizeTimeToUnix,
    normalizeTimePlusOneDayToUnix,
    normalizeTimeFromUnix
};
