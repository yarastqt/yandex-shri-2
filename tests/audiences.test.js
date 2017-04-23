'use strict';

/* eslint-disable max-len */
const { Types } = require('mongoose');
const chai = require('chai');
const http = require('chai-http');

const { Audiences } = require('../lib/models');
const server = require('../lib/server');

const expect = chai.expect;

chai.use(http);

describe('Audiences Controller', () => {
    let createdAudiences = null;

    /**
     * Remove all entries before test
     */
    before(async () => {
        await Audiences.remove({});
    });

    /**
     * Create test entries
     */
    before(async () => {
        createdAudiences = await Audiences.create([
            { name: 'Тестовая аудитория 1', capacity: 10, location: 'Тестовая локация' },
            { name: 'Тестовая аудитория 2', capacity: 40, location: 'Тестовая локация' }
        ]);
    });

    /**
     * Remove all entries after success or failure test
     */
    after(async () => {
        await Audiences.remove({});
    });

    describe('GET: /api/v1/audiences', () => {
        it('Should return array of audiences', (done) => {
            chai.request(server)
                .get('/api/v1/audiences')
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.be.an('array');
                    done();
                });
        });
    });

    describe('POST: /api/v1/audiences', () => {
        it('Should return error that fields can not be blank', (done) => {
            chai.request(server)
                .post('/api/v1/audiences')
                .send({})
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'location', message: 'Укажите местонахождение аудитории' },
                            { field: 'name', message: 'Укажите название аудитории' }
                        ]);
                    done();
                });
        });

        it('Should return error that studentsCount should be number', (done) => {
            chai.request(server)
                .post('/api/v1/audiences')
                .send({
                    name: 'Тестовая аудитория',
                    location: 'Тестовая локация',
                    capacity: 'Неверное число'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'capacity', message: 'Значение должно быть числом', value: 'Неверное число' }
                        ]);
                    done();
                });
        });

        it('Should return error that capacity should be positive number', (done) => {
            chai.request(server)
                .post('/api/v1/audiences')
                .send({
                    name: 'Тестовая аудитория',
                    location: 'Тестовая локация',
                    capacity: -1
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'capacity', message: 'Значение должно быть положительным числом', value: -1 }
                        ]);
                    done();
                });
        });

        it('Should return error that name is already exist', (done) => {
            chai.request(server)
                .post('/api/v1/audiences')
                .send({
                    name: 'Тестовая аудитория 1',
                    location: 'Тестовая локация',
                    capacity: 10
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'name', message: 'Аудитория с таким названием уже существует', value: 'Тестовая аудитория 1' }
                        ]);
                    done();
                });
        });

        it('Should return new audience', (done) => {
            chai.request(server)
                .post('/api/v1/audiences')
                .send({
                    name: 'Тестовая аудитория',
                    location: 'Тестовая локация',
                    capacity: 10
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(201);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('id');
                    expect(body).to.have.property('name', 'Тестовая аудитория');
                    expect(body).to.have.property('location', 'Тестовая локация');
                    expect(body).to.have.property('capacity', 10);
                    done();
                });
        });
    });

    describe('PUT: /api/v1/audiences/:audienceID', () => {
        it('Should return error that id is invalid', (done) => {
            chai.request(server)
                .put('/api/v1/audiences/invalidID')
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'audienceID', message: 'Неверный параметр', value: 'invalidID' }
                        ]);
                    done();
                });
        });

        it('Should return error that audience not found', (done) => {
            const nonExistentId = Types.ObjectId();

            chai.request(server)
                .put(`/api/v1/audiences/${nonExistentId}`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(404);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 404);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'id', message: 'Аудитория с таким ID неизвестна', value: nonExistentId.toString() }
                        ]);
                    done();
                });
        });

        it('Should return error that fields can not be blank', (done) => {
            chai.request(server)
                .put(`/api/v1/audiences/${createdAudiences[0].id}`)
                .send({})
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'name', message: 'Укажите название аудитории' },
                            { field: 'location', message: 'Укажите местонахождение аудитории' }
                        ]);
                    done();
                });
        });

        it('Should return error that studentsCount should be number', (done) => {
            chai.request(server)
                .put(`/api/v1/audiences/${createdAudiences[0].id}`)
                .send({
                    name: 'Обновленная тестовая аудитория',
                    location: 'Обновленная тестовая локация',
                    capacity: 'Неверное число'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'capacity', message: 'Значение должно быть числом', value: 'Неверное число' }
                        ]);
                    done();
                });
        });

        it('Should return error that capacity should be positive number', (done) => {
            chai.request(server)
                .put(`/api/v1/audiences/${createdAudiences[0].id}`)
                .send({
                    name: 'Обновленная тестовая аудитория',
                    location: 'Обновленная тестовая локация',
                    capacity: -1
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'capacity', message: 'Значение должно быть положительным числом', value: -1 }
                        ]);
                    done();
                });
        });

        it('Should return error that name is already exist', (done) => {
            chai.request(server)
                .put(`/api/v1/audiences/${createdAudiences[0].id}`)
                .send({
                    name: 'Тестовая аудитория 2',
                    location: 'Тестовая локация',
                    capacity: 10
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'name', message: 'Аудитория с таким названием уже существует', value: 'Тестовая аудитория 2' }
                        ]);
                    done();
                });
        });

        it('Should return updated audience', (done) => {
            chai.request(server)
                .put(`/api/v1/audiences/${createdAudiences[0].id}`)
                .send({
                    name: 'Обновленная тестовая аудитория',
                    location: 'Обновленная тестовая локация',
                    capacity: 20
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('id');
                    expect(body).to.have.property('name', 'Обновленная тестовая аудитория');
                    expect(body).to.have.property('location', 'Обновленная тестовая локация');
                    expect(body).to.have.property('capacity', 20);
                    done();
                });
        });
    });

    describe('DELETE: /api/v1/audiences/:audienceID', () => {
        it('Should return error that id is invalid', (done) => {
            chai.request(server)
                .delete('/api/v1/audiences/invalidID')
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'audienceID', message: 'Неверный параметр', value: 'invalidID' }
                        ]);
                    done();
                });
        });

        it('Should return error that audience not found', (done) => {
            const nonExistentId = Types.ObjectId();

            chai.request(server)
                .delete(`/api/v1/audiences/${nonExistentId}`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(404);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 404);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'id', message: 'Аудитория с таким ID неизвестна', value: nonExistentId.toString() }
                        ]);
                    done();
                });
        });

        it('Should return id of deleted audience', (done) => {
            chai.request(server)
                .delete(`/api/v1/audiences/${createdAudiences[0].id}`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.have.property('id', createdAudiences[0].id);
                    done();
                });
        });
    });
});
