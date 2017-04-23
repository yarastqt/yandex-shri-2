'use strict';

const { Schools, Lectures } = require('../models');
const { getSchoolData, normalizeErrors } = require('../utils');
const { validateParamID } = require('../middlewares');

function SchoolsController(api) {
    api.param('schoolID', validateParamID('schoolID'));

    api.param('schoolID', async (request, response, next, schoolID) => {
        try {
            request.school = await Schools.findById(schoolID);

            if (!request.school) {
                return response.status(404).json({
                    code: 404,
                    errors: [{
                        field: 'id',
                        message: 'Школа с таким ID неизвестна',
                        value: schoolID
                    }]
                });
            }

            return next();
        } catch (error) {
            return next(error);
        }
    });

    api.get('/schools/:schoolID/lectures', async (request, response, next) => {
        try {
            const { schoolID } = request.params;
            const { start, end } = request.query;
            const lecturesList = await Lectures.getListByDateRange('schools', schoolID, start, end);

            return response.status(200).json(lecturesList);
        } catch (error) {
            return next(error);
        }
    });

    api.get('/schools', async (request, response, next) => {
        try {
            const schools = await Schools.find();

            return response.status(200).json(schools);
        } catch (error) {
            return next(error);
        }
    });

    api.post('/schools', async (request, response, next) => {
        try {
            const schoolData = getSchoolData(request.body);
            const createdSchool = await Schools.create(schoolData);

            return response.status(201).json(createdSchool);
        } catch (error) {
            if (error.name === 'ValidationError' || error.name === 'CastError') {
                return response.status(400).json({
                    code: 400,
                    errors: normalizeErrors(error)
                });
            }

            return next(error);
        }
    });

    api.put('/schools/:schoolID', async (request, response, next) => {
        try {
            const schoolData = getSchoolData(request.body);
            const preparedSchool = Object.assign(request.school, schoolData);
            const updatedSchool = await preparedSchool.save();

            return response.status(200).json(updatedSchool);
        } catch (error) {
            if (error.name === 'ValidationError' || error.name === 'CastError') {
                return response.status(400).json({
                    code: 400,
                    errors: normalizeErrors(error)
                });
            }

            return next(error);
        }
    });

    api.delete('/schools/:schoolID', async (request, response, next) => {
        try {
            const { _id } = await request.school.remove();

            return response.status(200).json({ id: _id });
        } catch (error) {
            return next(error);
        }
    });
}

module.exports = SchoolsController;
