'use strict';

const path = require('path');
const express = require('express');

const { Router } = express;
const webRouter = Router();

webRouter.use(express.static(path.join(__dirname, '../../app/')));

webRouter.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '../../app/index.html'));
});

module.exports = webRouter;
