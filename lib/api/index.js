'use strict';

const { Router } = require('express');

const LecturesController = require('./lectures');
const AudiencesController = require('./audiences');
const SchoolsController = require('./schools');

const APIRouter = Router();

LecturesController(APIRouter);
AudiencesController(APIRouter);
SchoolsController(APIRouter);

module.exports = APIRouter;
