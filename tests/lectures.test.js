'use strict';

/* eslint-disable max-len */
const { Types } = require('mongoose');
const chai = require('chai');
const http = require('chai-http');

const { Schools, Audiences, Lectures } = require('../lib/models');
const server = require('../lib/server');

const expect = chai.expect;

chai.use(http);

describe('Lectures Controller', () => {
    let createdSchools = null;
    let createdAudiences = null;
    let createdLectures = null;

    /**
     * Remove all entries before test
     */
    before(async () => {
        await Schools.remove({});
        await Audiences.remove({});
        await Lectures.remove({});
    });

    /**
     * Create test entries
     */
    before(async () => {
        createdSchools = await Schools.create([
            { name: 'Тестовая школа 1', studentsCount: 10 },
            { name: 'Тестовая школа 2', studentsCount: 20 },
            { name: 'Тестовая школа 3', studentsCount: 10 },
            { name: 'Тестовая школа 4', studentsCount: 30 },
            { name: 'Тестовая школа 5', studentsCount: 32 }
        ]);
        createdAudiences = await Audiences.create([
            { name: 'Тестовая аудитория 1', capacity: 10, location: 'Тестовая локация' },
            { name: 'Тестовая аудитория 2', capacity: 40, location: 'Тестовая локация' },
            { name: 'Тестовая аудитория 3', capacity: 30, location: 'Тестовая локация' },
            { name: 'Тестовая аудитория 4', capacity: 38, location: 'Тестовая локация' },
            { name: 'Тестовая аудитория 5', capacity: 42, location: 'Тестовая локация' }
        ]);
        createdLectures = await Lectures.create([
            { name: 'Тестовая лекция 1', schools: [createdSchools[0].id], lecturers: ['Тестовый лектор'], audience: createdAudiences[0].id, startTime: '02-02-2017 10:00', endTime: '02-02-2017 12:00' },
            { name: 'Тестовая лекция 2', schools: [createdSchools[0].id], lecturers: ['Тестовый лектор'], audience: createdAudiences[0].id, startTime: '03-02-2017 16:00', endTime: '03-02-2017 18:00' },
            { name: 'Тестовая лекция 3', schools: [createdSchools[0].id], lecturers: ['Тестовый лектор'], audience: createdAudiences[0].id, startTime: '04-02-2017 19:00', endTime: '04-02-2017 20:00' },
            { name: 'Тестовая лекция 4', schools: [createdSchools[0].id], lecturers: ['Тестовый лектор'], audience: createdAudiences[0].id, startTime: '05-02-2017 15:00', endTime: '05-02-2017 17:00' },
            { name: 'Тестовая лекция 5', schools: [createdSchools[3].id], lecturers: ['Тестовый лектор'], audience: createdAudiences[2].id, startTime: '10-20-2017 16:00', endTime: '10-20-2017 17:20' },
            { name: 'Тестовая лекция 6', schools: [createdSchools[3].id], lecturers: ['Тестовый лектор'], audience: createdAudiences[2].id, startTime: '10-27-2017 14:00', endTime: '10-27-2017 16:00' },
            { name: 'Тестовая лекция 7', schools: [createdSchools[4].id], lecturers: ['Тестовый лектор'], audience: createdAudiences[3].id, startTime: '10-19-2017 10:00', endTime: '10-19-2017 12:00' },
            { name: 'Тестовая лекция 8', schools: [createdSchools[4].id], lecturers: ['Тестовый лектор'], audience: createdAudiences[3].id, startTime: '10-19-2017 13:00', endTime: '10-19-2017 15:00' }
        ]);
    });

    /**
     * Remove all entries after success or failure test
     */
    after(async () => {
        await Schools.remove({});
        await Audiences.remove({});
        await Lectures.remove({});
    });

    describe('GET: /api/v1/lectures', () => {
        it('Should return array of lectures', (done) => {
            chai.request(server)
                .get('/api/v1/lectures')
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.be.an('array');
                    done();
                });
        });

        it('Should return array of lectures by school id', (done) => {
            chai.request(server)
                .get(`/api/v1/schools/${createdSchools[0].id}/lectures`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.be.an('array').to.have.lengthOf(4);
                    done();
                });
        });

        it('Should return array of lectures in date range by school id', (done) => {
            chai.request(server)
                .get(`/api/v1/schools/${createdSchools[0].id}/lectures?start=03-02-2017&end=04-02-2017`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.be.an('array').to.have.lengthOf(2);
                    done();
                });
        });

        it('Should return array of lectures by audience id', (done) => {
            chai.request(server)
                .get(`/api/v1/audiences/${createdAudiences[0].id}/lectures`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.be.an('array').to.have.lengthOf(4);
                    done();
                });
        });

        it('Should return array of lectures in date range by audience id', (done) => {
            chai.request(server)
                .get(`/api/v1/audiences/${createdAudiences[0].id}/lectures?start=03-02-2017&end=04-02-2017`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.be.an('array').to.have.lengthOf(2);
                    done();
                });
        });
    });

    describe('POST: /api/v1/lectures', () => {
        it('Should return error that fields can not be blank', (done) => {
            chai.request(server)
                .post('/api/v1/lectures')
                .send({})
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'endTime', message: 'Укажите конец лекции' },
                            { field: 'startTime', message: 'Укажите начало лекции' },
                            { field: 'audience', message: 'Укажите ID аудитории' },
                            { field: 'lecturers', message: 'Укажите лектора' },
                            { field: 'schools', message: 'Укажите ID школы' },
                            { field: 'name', message: 'Укажите название лекции' }
                        ]);
                    done();
                });
        });

        it('Should return error that date is invalid format', (done) => {
            chai.request(server)
                .post('/api/v1/lectures')
                .send({
                    name: 'Тестовая лекция',
                    schools: [createdSchools[0].id],
                    lecturers: ['Тестовый лектор'],
                    audience: createdAudiences[0].id,
                    startTime: 'Неверная дата',
                    endTime: 'Неверная дата'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'endTime', message: 'Неверный формат времени', value: 'Неверная дата' },
                            { field: 'startTime', message: 'Неверный формат времени', value: 'Неверная дата' }
                        ]);
                    done();
                });
        });

        it('Should return error that startDate should be larger than endDate or versa ', (done) => {
            chai.request(server)
                .post('/api/v1/lectures')
                .send({
                    name: 'Тестовая лекция',
                    schools: [createdSchools[0].id],
                    lecturers: ['Тестовый лектор'],
                    audience: createdAudiences[0].id,
                    startTime: '01-01-2017 14:00',
                    endTime: '01-01-2017 12:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'endTime', message: 'Конец лекции должен быть позднее, чем начало', value: '01-01-2017 12:00' },
                            { field: 'startTime', message: 'Начало лекции должно быть раньше, чем конец', value: '01-01-2017 14:00' }
                        ]);
                    done();
                });
        });

        it('Should return error that capacity of audience less than students count', (done) => {
            chai.request(server)
                .post('/api/v1/lectures')
                .send({
                    name: 'Тестовая лекция',
                    schools: [createdSchools[1].id],
                    lecturers: ['Тестовый лектор'],
                    audience: createdAudiences[0].id,
                    startTime: '01-01-2017 14:00',
                    endTime: '01-01-2017 16:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'audience', message: 'Вместимость аудитории меньше чем количество студентов', value: createdAudiences[0].id }
                        ]);
                    done();
                });
        });

        it('Should return error that in this audience at this time have lecture', (done) => {
            chai.request(server)
                .post('/api/v1/lectures')
                .send({
                    name: 'Тестовая лекция',
                    schools: [createdSchools[2].id],
                    lecturers: ['Тестовый лектор'],
                    audience: createdAudiences[0].id,
                    startTime: '02-02-2017 11:00',
                    endTime: '02-02-2017 14:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'audience', message: 'В этой аудитории, в данное время уже назначена лекция', value: createdAudiences[0].id }
                        ]);
                    done();
                });
        });

        it('Should return error that in this school at this time have lecture', (done) => {
            chai.request(server)
                .post('/api/v1/lectures')
                .send({
                    name: 'Тестовая лекция',
                    schools: [createdSchools[0].id],
                    lecturers: ['Тестовый лектор'],
                    audience: createdAudiences[1].id,
                    startTime: '02-02-2017 11:00',
                    endTime: '02-02-2017 14:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'schools', message: 'У этой школы, в данное время уже назначена лекция', value: [createdSchools[0].id] }
                        ]);
                    done();
                });
        });

        it('Should return error that name is already exist', (done) => {
            chai.request(server)
                .post('/api/v1/lectures')
                .send({
                    name: 'Тестовая лекция 1',
                    schools: [createdSchools[0].id],
                    lecturers: ['Тестовый лектор'],
                    audience: createdAudiences[1].id,
                    startTime: '02-02-2017 17:00',
                    endTime: '02-02-2017 18:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'name', message: 'Лекция с таким названием уже существует', value: 'Тестовая лекция 1' }
                        ]);
                    done();
                });
        });

        it('Should return error that audience by this id not exists', (done) => {
            const nonExistentId = Types.ObjectId();

            chai.request(server)
                .post('/api/v1/lectures')
                .send({
                    name: 'Тестовая лекция',
                    schools: [createdSchools[0].id],
                    lecturers: ['Тестовый лектор'],
                    audience: nonExistentId,
                    startTime: '01-01-2017 14:00',
                    endTime: '01-01-2017 16:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'audience', message: 'Аудитория с таким ID неизвестна', value: nonExistentId.toString() }
                        ]);
                    done();
                });
        });

        it('Should return error that schools by this id\'s not exists', (done) => {
            const nonExistentId = Types.ObjectId();

            chai.request(server)
                .post('/api/v1/lectures')
                .send({
                    name: 'Тестовая лекция',
                    schools: [nonExistentId],
                    lecturers: ['Тестовый лектор'],
                    audience: createdAudiences[0].id,
                    startTime: '01-01-2017 14:00',
                    endTime: '01-01-2017 16:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'schools', message: 'Школа с таким ID неизвестна', value: [nonExistentId.toString()] }
                        ]);
                    done();
                });
        });

        it('Should return error that schools ID\'s or audience ID is invalid', (done) => {
            chai.request(server)
                .post('/api/v1/lectures')
                .send({
                    name: 'Тестовая лекция',
                    schools: ['invalidID'],
                    lecturers: ['Тестовый лектор'],
                    audience: 'invalidID',
                    startTime: '01-01-2017 14:00',
                    endTime: '01-01-2017 16:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'audience', message: 'Неверный параметр', value: 'invalidID' },
                            { field: 'schools', message: 'Неверный параметр', value: ['invalidID'] }
                        ]);
                    done();
                });
        });

        it('Should return new lecture', (done) => {
            chai.request(server)
                .post('/api/v1/lectures')
                .send({
                    name: 'Тестовая лекция',
                    schools: [createdSchools[0].id],
                    lecturers: ['Тестовый лектор'],
                    audience: createdAudiences[0].id,
                    startTime: '01-01-2017 14:00',
                    endTime: '01-01-2017 16:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(201);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('id');
                    expect(body).to.have.property('name', 'Тестовая лекция');
                    expect(body).to.have.deep.property('schools[0].name', 'Тестовая школа 1');
                    expect(body).to.have.deep.property('lecturers[0]', 'Тестовый лектор');
                    expect(body).to.have.deep.property('audience.name', 'Тестовая аудитория 1');
                    expect(body).to.have.property('startTime', '01-01-2017 14:00');
                    expect(body).to.have.property('endTime', '01-01-2017 16:00');
                    done();
                });
        });
    });

    describe('PUT: /api/v1/lectures/:lectureID', () => {
        it('Should return error that id is invalid', (done) => {
            chai.request(server)
                .put('/api/v1/lectures/invalidID')
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'lectureID', message: 'Неверный параметр', value: 'invalidID' }
                        ]);
                    done();
                });
        });

        it('Should return error that lecture not found', (done) => {
            const nonExistentId = Types.ObjectId();

            chai.request(server)
                .put(`/api/v1/lectures/${nonExistentId}`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(404);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 404);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'id', message: 'Лекция с таким ID неизвестна', value: nonExistentId.toString() }
                        ]);
                    done();
                });
        });

        it('Should return error that fields can not be blank', (done) => {
            chai.request(server)
                .put(`/api/v1/lectures/${createdLectures[0].id}`)
                .send({})
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'name', message: 'Укажите название лекции' },
                            { field: 'schools', message: 'Укажите ID школы' },
                            { field: 'lecturers', message: 'Укажите лектора' },
                            { field: 'audience', message: 'Укажите ID аудитории' },
                            { field: 'startTime', message: 'Укажите начало лекции' },
                            { field: 'endTime', message: 'Укажите конец лекции' }
                        ]);
                    done();
                });
        });

        it('Should return error that date is invalid format', (done) => {
            chai.request(server)
                .put(`/api/v1/lectures/${createdLectures[0].id}`)
                .send({
                    name: 'Обновленная тестовая лекция',
                    schools: [createdSchools[0].id, createdSchools[1].id],
                    lecturers: ['Обновленный тестовый лектор'],
                    audience: createdAudiences[1].id,
                    startTime: 'Неверная дата',
                    endTime: 'Неверная дата'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'startTime', message: 'Неверный формат времени', value: 'Неверная дата' },
                            { field: 'endTime', message: 'Неверный формат времени', value: 'Неверная дата' }
                        ]);
                    done();
                });
        });

        it('Should return error that startDate should be larger than endDate or versa ', (done) => {
            chai.request(server)
                .put(`/api/v1/lectures/${createdLectures[0].id}`)
                .send({
                    name: 'Обновленная тестовая лекция',
                    schools: [createdSchools[0].id, createdSchools[1].id],
                    lecturers: ['Обновленный тестовый лектор'],
                    audience: createdAudiences[1].id,
                    startTime: '01-01-2017 14:00',
                    endTime: '01-01-2017 12:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'startTime', message: 'Начало лекции должно быть раньше, чем конец', value: '01-01-2017 14:00' },
                            { field: 'endTime', message: 'Конец лекции должен быть позднее, чем начало', value: '01-01-2017 12:00' }
                        ]);
                    done();
                });
        });

        it('Should return error that capacity of audience less than students count', (done) => {
            chai.request(server)
                .put(`/api/v1/lectures/${createdLectures[0].id}`)
                .send({
                    name: 'Обновленная тестовая лекция',
                    schools: [createdSchools[0].id, createdSchools[1].id],
                    lecturers: ['Обновленный тестовый лектор'],
                    audience: createdAudiences[0].id,
                    startTime: '02-02-2017 09:00',
                    endTime: '02-02-2017 13:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'audience', message: 'Вместимость аудитории меньше чем количество студентов', value: createdAudiences[0].id }
                        ]);
                    done();
                });
        });

        it('Should return error that in this audience at this time have lecture', (done) => {
            chai.request(server)
                .put(`/api/v1/lectures/${createdLectures[4].id}`)
                .send({
                    name: 'Лекция 1. Адаптивная вёрстка',
                    schools: [createdSchools[3].id],
                    lecturers: ['Дмитрий Душкин'],
                    audience: createdAudiences[3].id,
                    startTime: '10-19-17 10:00',
                    endTime: '10-19-17 12:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'audience', message: 'В этой аудитории, в данное время уже назначена лекция', value: createdAudiences[3].id }
                        ]);
                    done();
                });
        });

        it('Should return error that in this school at this time have lecture', (done) => {
            chai.request(server)
                .put(`/api/v1/lectures/${createdLectures[4].id}`)
                .send({
                    name: 'Лекция 1. Адаптивная вёрстка',
                    schools: [createdSchools[3].id],
                    lecturers: ['Дмитрий Душкин'],
                    audience: createdAudiences[3].id,
                    startTime: '10-27-17 14:00',
                    endTime: '10-27-17 16:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'schools', message: 'У этой школы, в данное время уже назначена лекция', value: [createdSchools[3].id] }
                        ]);
                    done();
                });
        });

        it('Should return error that name is already exist', (done) => {
            chai.request(server)
                .put(`/api/v1/lectures/${createdLectures[0].id}`)
                .send({
                    name: 'Тестовая лекция 2',
                    schools: [createdSchools[0].id],
                    lecturers: ['Тестовый лектор'],
                    audience: createdAudiences[1].id,
                    startTime: '02-02-2017 17:00',
                    endTime: '02-02-2017 18:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'name', message: 'Лекция с таким названием уже существует', value: 'Тестовая лекция 2' }
                        ]);
                    done();
                });
        });

        it('Should return error that audience by this id not exists', (done) => {
            const nonExistentId = Types.ObjectId();

            chai.request(server)
                .put(`/api/v1/lectures/${createdLectures[0].id}`)
                .send({
                    name: 'Обновленная тестовая лекция',
                    schools: [createdSchools[1].id],
                    lecturers: ['Обновленный тестовый лектор'],
                    audience: nonExistentId,
                    startTime: '02-01-2017 20:00',
                    endTime: '02-01-2017 22:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'audience', message: 'Аудитория с таким ID неизвестна', value: nonExistentId.toString() }
                        ]);
                    done();
                });
        });

        it('Should return error that schools by this id\'s not exists', (done) => {
            const nonExistentId = Types.ObjectId();

            chai.request(server)
                .put(`/api/v1/lectures/${createdLectures[0].id}`)
                .send({
                    name: 'Обновленная тестовая лекция',
                    schools: [nonExistentId],
                    lecturers: ['Обновленный тестовый лектор'],
                    audience: createdAudiences[0].id,
                    startTime: '02-01-2017 20:00',
                    endTime: '02-01-2017 22:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'schools', message: 'Школа с таким ID неизвестна', value: [nonExistentId.toString()] }
                        ]);
                    done();
                });
        });

        it('Should return error that schools ID\'s or audience ID is invalid', (done) => {
            chai.request(server)
                .put(`/api/v1/lectures/${createdLectures[0].id}`)
                .send({
                    name: 'Обновленная тестовая лекция',
                    schools: ['invalidID'],
                    lecturers: ['Обновленный тестовый лектор'],
                    audience: 'invalidID',
                    startTime: '02-01-2017 20:00',
                    endTime: '02-01-2017 22:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'schools', message: 'Неверный параметр', value: ['invalidID'] },
                            { field: 'audience', message: 'Неверный параметр', value: 'invalidID' }
                        ]);
                    done();
                });
        });

        it('Should return updated lecture', (done) => {
            chai.request(server)
                .put(`/api/v1/lectures/${createdLectures[0].id}`)
                .send({
                    name: 'Обновленная тестовая лекция',
                    schools: [createdSchools[1].id],
                    lecturers: ['Обновленный тестовый лектор'],
                    audience: createdAudiences[1].id,
                    startTime: '02-01-2017 20:00',
                    endTime: '02-01-2017 22:00'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('id');
                    expect(body).to.have.property('name', 'Обновленная тестовая лекция');
                    expect(body).to.have.deep.property('schools[0].name', 'Тестовая школа 2');
                    expect(body).to.have.deep.property('lecturers[0]', 'Обновленный тестовый лектор');
                    expect(body).to.have.deep.property('audience.name', 'Тестовая аудитория 2');
                    expect(body).to.have.property('startTime', '02-01-2017 20:00');
                    expect(body).to.have.property('endTime', '02-01-2017 22:00');
                    done();
                });
        });
    });

    describe('DELETE: /api/v1/lectures/:lectureID', () => {
        it('Should return error that id is invalid', (done) => {
            chai.request(server)
                .delete('/api/v1/lectures/invalidID')
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'lectureID', message: 'Неверный параметр', value: 'invalidID' }
                        ]);
                    done();
                });
        });

        it('Should return error that lecture not found', (done) => {
            const nonExistentId = Types.ObjectId();

            chai.request(server)
                .delete(`/api/v1/lectures/${nonExistentId}`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(404);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 404);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'id', message: 'Лекция с таким ID неизвестна', value: nonExistentId.toString() }
                        ]);
                    done();
                });
        });

        it('Should return id of deleted lecture', (done) => {
            chai.request(server)
                .delete(`/api/v1/lectures/${createdLectures[0].id}`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.have.property('id', createdLectures[0].id);
                    done();
                });
        });
    });
});
