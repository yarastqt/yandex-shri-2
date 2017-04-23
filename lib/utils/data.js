'use strict';

function getUniqueArray(array) {
    return Array.from(new Set(array));
}

function getSchoolData(data) {
    return {
        name: data.name || null,
        studentsCount: data.studentsCount || null
    };
}

function getAudienceData(data) {
    return {
        name: data.name || null,
        capacity: data.capacity || null,
        location: data.location || null
    };
}

function getLectureData(data) {
    return {
        name: data.name || null,
        schools: data.schools ? getUniqueArray(data.schools).filter((v) => v) : [],
        lecturers: data.lecturers ? getUniqueArray(data.lecturers).filter((v) => v) : [],
        audience: data.audience || null,
        startTime: data.startTime || null,
        endTime: data.endTime || null
    };
}

module.exports = {
    getSchoolData,
    getAudienceData,
    getLectureData
};
