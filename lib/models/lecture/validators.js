'use strict';

const Audiences = require('../audience');
const Schools = require('../school');

async function schoolsTimeValidator() {
    if (!this.startTime || !this.endTime || !this.schools) {
        return true;
    }

    const lectureList = await this.model('Lecture').find({
        schools: {
            $in: this.schools
        },
        startTime: {
            $lte: this.endTime
        },
        endTime: {
            $gte: this.startTime
        }
    });

    const haveLecture = lectureList.every(({ _id }) => _id.toString() === this._id.toString());

    return haveLecture;
}

async function existsSchoolsValidator() {
    if (!this.schools) {
        return true;
    }

    const schoolsList = await Schools.find({
        _id: {
            $in: this.schools
        }
    });

    return schoolsList.length === this.schools.length;
}

async function existsAudienceValidator() {
    if (!this.audience) {
        return true;
    }

    const audience = await Audiences.findById(this.audience);

    if (!audience) {
        return false;
    }

    return true;
}

async function audienceCapacityValidator() {
    if (!this.audience || !this.schools) {
        return true;
    }

    const audience = await Audiences.findById(this.audience);
    const schoolsList = await Schools.find({
        _id: {
            $in: this.schools
        }
    });

    const totalStudentsCount = schoolsList.reduce((total, { studentsCount }) => total + studentsCount, 0);

    return audience.capacity >= totalStudentsCount;
}

async function audienceTimeValidator() {
    if (!this.startTime || !this.endTime || !this.audience) {
        return true;
    }

    const haveLectureInAudience = await this.model('Lecture').findOne({
        audience: this.audience,
        startTime: {
            $lte: this.endTime
        },
        endTime: {
            $gte: this.startTime
        }
    });

    if (haveLectureInAudience) {
        if (haveLectureInAudience._id.toString() !== this._id.toString()) {
            return false;
        }
    }

    return true;
}

function timeValidator() {
    if (!this.startTime || !this.endTime) {
        return true;
    }

    return this.startTime < this.endTime;
}

module.exports = {
    schoolsTimeValidator,
    existsSchoolsValidator,
    existsAudienceValidator,
    audienceCapacityValidator,
    audienceTimeValidator,
    timeValidator
};
