'use strict';

const log = require('./log');
const { normalizeErrors } = require('./errors');
const {
    getAudienceData,
    getSchoolData,
    getLectureData
} = require('./data');
const {
    normalizeTimeToUnix,
    normalizeTimePlusOneDayToUnix,
    normalizeTimeFromUnix
} = require('./date');

module.exports = {
    log,
    getAudienceData,
    getSchoolData,
    getLectureData,
    normalizeErrors,
    normalizeTimeToUnix,
    normalizeTimePlusOneDayToUnix,
    normalizeTimeFromUnix
};
