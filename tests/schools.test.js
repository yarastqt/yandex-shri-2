'use strict';

/* eslint-disable max-len */
const { Types } = require('mongoose');
const chai = require('chai');
const http = require('chai-http');

const { Schools } = require('../lib/models');
const server = require('../lib/server');

const expect = chai.expect;

chai.use(http);

describe('Schools Controller', () => {
    let createdSchools = null;

    /**
     * Remove all entries before test
     */
    before(async () => {
        await Schools.remove({});
    });

    /**
     * Create test entries
     */
    before(async () => {
        createdSchools = await Schools.create([
            { name: 'Тестовая школа 1', studentsCount: 10 },
            { name: 'Тестовая школа 2', studentsCount: 20 },
            { name: 'Тестовая школа 3', studentsCount: 10 }
        ]);
    });

    /**
     * Remove all entries after success or failure test
     */
    after(async () => {
        await Schools.remove({});
    });

    describe('GET: /api/v1/schools', () => {
        it('Should return array of schools', (done) => {
            chai.request(server)
                .get('/api/v1/schools')
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.be.an('array');
                    done();
                });
        });
    });

    describe('POST: /api/v1/schools', () => {
        it('Should return error that fields can not be blank', (done) => {
            chai.request(server)
                .post('/api/v1/schools')
                .send({})
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'name', message: 'Укажите название школы' }
                        ]);
                    done();
                });
        });

        it('Should return error that studentsCount should be number', (done) => {
            chai.request(server)
                .post('/api/v1/schools')
                .send({
                    name: 'Тестовая школа',
                    studentsCount: 'Неверное число'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'studentsCount', message: 'Значение должно быть числом', value: 'Неверное число' }
                        ]);
                    done();
                });
        });

        it('Should return error that studentsCount should be positive number', (done) => {
            chai.request(server)
                .post('/api/v1/schools')
                .send({
                    name: 'Тестовая школа',
                    studentsCount: -1
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'studentsCount', message: 'Значение должно быть положительным числом', value: -1 }
                        ]);
                    done();
                });
        });

        it('Should return error that name is already exist', (done) => {
            chai.request(server)
                .post('/api/v1/schools')
                .send({
                    name: 'Тестовая школа 1',
                    studentsCount: 10
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'name', message: 'Школа с таким названием уже существует', value: 'Тестовая школа 1' }
                        ]);
                    done();
                });
        });

        it('Should return new school', (done) => {
            chai.request(server)
                .post('/api/v1/schools')
                .send({
                    name: 'Тестовая школа',
                    studentsCount: 10
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(201);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('id');
                    expect(body).to.have.property('name', 'Тестовая школа');
                    expect(body).to.have.property('studentsCount', 10);
                    done();
                });
        });
    });

    describe('PUT: /api/v1/schools/:schoolID', () => {
        it('Should return error that id is invalid', (done) => {
            chai.request(server)
                .put('/api/v1/schools/invalidID')
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'schoolID', message: 'Неверный параметр', value: 'invalidID' }
                        ]);
                    done();
                });
        });

        it('Should return error that school not found', (done) => {
            const nonExistentId = Types.ObjectId();

            chai.request(server)
                .put(`/api/v1/schools/${nonExistentId}`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(404);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 404);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'id', message: 'Школа с таким ID неизвестна', value: nonExistentId.toString() }
                        ]);
                    done();
                });
        });

        it('Should return error that fields can not be blank', (done) => {
            chai.request(server)
                .put(`/api/v1/schools/${createdSchools[0].id}`)
                .send({})
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'name', message: 'Укажите название школы' }
                        ]);
                    done();
                });
        });

        it('Should return error that studentsCount should be number', (done) => {
            chai.request(server)
                .put(`/api/v1/schools/${createdSchools[0].id}`)
                .send({
                    name: 'Обновленная тестовая школа',
                    studentsCount: 'Неверное число'
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'studentsCount', message: 'Значение должно быть числом', value: 'Неверное число' }
                        ]);
                    done();
                });
        });

        it('Should return error that studentsCount should be positive number', (done) => {
            chai.request(server)
                .put(`/api/v1/schools/${createdSchools[0].id}`)
                .send({
                    name: 'Обновленная тестовая школа',
                    studentsCount: -1
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'studentsCount', message: 'Значение должно быть положительным числом', value: -1 }
                        ]);
                    done();
                });
        });

        it('Should return error that name is already exist', (done) => {
            chai.request(server)
                .put(`/api/v1/schools/${createdSchools[0].id}`)
                .send({
                    name: 'Тестовая школа 2',
                    studentsCount: 10
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'name', message: 'Школа с таким названием уже существует', value: 'Тестовая школа 2' }
                        ]);
                    done();
                });
        });

        it('Should return updated school', (done) => {
            chai.request(server)
                .put(`/api/v1/schools/${createdSchools[0].id}`)
                .send({
                    name: 'Обновленная тестовая школа',
                    studentsCount: 20
                })
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('id');
                    expect(body).to.have.property('name', 'Обновленная тестовая школа');
                    expect(body).to.have.property('studentsCount', 20);
                    done();
                });
        });
    });

    describe('DELETE: /api/v1/schools/:schoolID', () => {
        it('Should return error that id is invalid', (done) => {
            chai.request(server)
                .delete('/api/v1/schools/invalidID')
                .end((error, { status, body }) => {
                    expect(status).to.equals(400);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 400);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'schoolID', message: 'Неверный параметр', value: 'invalidID' }
                        ]);
                    done();
                });
        });

        it('Should return error that school not found', (done) => {
            const nonExistentId = Types.ObjectId();

            chai.request(server)
                .delete(`/api/v1/schools/${nonExistentId}`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(404);
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code', 404);
                    expect(body).to.have.property('errors')
                        .that.is.an('array')
                        .that.deep.equals([
                            { field: 'id', message: 'Школа с таким ID неизвестна', value: nonExistentId.toString() }
                        ]);
                    done();
                });
        });

        it('Should return id of deleted school', (done) => {
            chai.request(server)
                .delete(`/api/v1/schools/${createdSchools[0].id}`)
                .end((error, { status, body }) => {
                    expect(status).to.equals(200);
                    expect(body).to.have.property('id', createdSchools[0].id);
                    done();
                });
        });
    });
});
