'use strict';

const { normalizeTimeToUnix, normalizeTimePlusOneDayToUnix } = require('../../utils');

const staticsMethods = {
    /**
     * Получение лекций в заданый интервал времени по таргету
     * @param target (String) - объект поиска, например: schools or audiences
     * @param targetId (ObjectId) - mongoose object id
     * @param start (String) - с какого дня, например: 01-01-16
     * @param end (String) - по какой день, например: 01-02-16
     * @return (Promise)
     */
    getListByDateRange(target, targetId, start, end) {
        const query = {
            [target]: targetId
        };

        if (start) {
            query.startTime = {
                $gte: normalizeTimeToUnix(start)
            };
        }

        if (end) {
            query.endTime = {
                $lte: normalizeTimePlusOneDayToUnix(end)
            };
        }

        return this.find(query);
    }
};

module.exports = staticsMethods;
