'use strict';

const { Audiences, Lectures } = require('../models');
const { getAudienceData, normalizeErrors } = require('../utils');
const { validateParamID } = require('../middlewares');

function AudiencesController(api) {
    api.param('audienceID', validateParamID('audienceID'));

    api.param('audienceID', async (request, response, next, audienceID) => {
        try {
            request.audience = await Audiences.findById(audienceID);

            if (!request.audience) {
                return response.status(404).json({
                    code: 404,
                    errors: [{
                        field: 'id',
                        message: 'Аудитория с таким ID неизвестна',
                        value: audienceID
                    }]
                });
            }

            return next();
        } catch (error) {
            return next(error);
        }
    });

    api.get('/audiences/:audienceID/lectures', async (request, response, next) => {
        try {
            const { audienceID } = request.params;
            const { start, end } = request.query;
            const lecturesList = await Lectures.getListByDateRange('audience', audienceID, start, end);

            return response.status(200).json(lecturesList);
        } catch (error) {
            return next(error);
        }
    });

    api.get('/audiences', async (request, response, next) => {
        try {
            const audiences = await Audiences.find();

            return response.status(200).json(audiences);
        } catch (error) {
            return next(error);
        }
    });

    api.post('/audiences', async (request, response, next) => {
        try {
            const audienceData = getAudienceData(request.body);
            const createdAudience = await Audiences.create(audienceData);

            return response.status(201).json(createdAudience);
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

    api.put('/audiences/:audienceID', async (request, response, next) => {
        try {
            const audienceData = getAudienceData(request.body);
            const preparedAudience = Object.assign(request.audience, audienceData);
            const updatedAudience = await preparedAudience.save();

            return response.status(200).json(updatedAudience);
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

    api.delete('/audiences/:audienceID', async (request, response, next) => {
        try {
            const { _id } = await request.audience.remove();

            return response.status(200).json({ id: _id });
        } catch (error) {
            return next(error);
        }
    });
}

module.exports = AudiencesController;
