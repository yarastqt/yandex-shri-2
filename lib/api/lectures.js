'use strict';

const { Lectures } = require('../models');
const { getLectureData, normalizeErrors } = require('../utils');
const { validateParamID } = require('../middlewares');

function LecturesController(api) {
    api.param('lectureID', validateParamID('lectureID'));

    api.param('lectureID', async (request, response, next, lectureID) => {
        try {
            request.lecture = await Lectures.findById(lectureID);

            if (!request.lecture) {
                return response.status(404).json({
                    code: 404,
                    errors: [{
                        field: 'id',
                        message: 'Лекция с таким ID неизвестна',
                        value: lectureID
                    }]
                });
            }

            return next();
        } catch (error) {
            return next(error);
        }
    });

    api.get('/lectures', async (request, response, next) => {
        try {
            const lecturesList = await Lectures.find();

            return response.status(200).json(lecturesList);
        } catch (error) {
            return next(error);
        }
    });

    api.post('/lectures', async (request, response, next) => {
        try {
            const lectureData = getLectureData(request.body);
            const savedLecture = await Lectures.create(lectureData);
            const createdLecture = await savedLecture.populate('schools audience', 'name').execPopulate();

            return response.status(201).json(createdLecture);
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

    api.put('/lectures/:lectureID', async (request, response, next) => {
        try {
            const lectureData = getLectureData(request.body);
            const preparedLecture = Object.assign(request.lecture, lectureData);

            const savedLecture = await preparedLecture.save();
            const updatedLecture = await savedLecture.populate('schools audience', 'name').execPopulate();

            return response.status(200).json(updatedLecture);
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

    api.delete('/lectures/:lectureID', async (request, response, next) => {
        try {
            const { _id } = await request.lecture.remove();

            return response.status(200).json({ id: _id });
        } catch (error) {
            return next(error);
        }
    });
}

module.exports = LecturesController;
