'use strict';

/* eslint-disable max-len */

// eslint-disable-next-line no-unused-vars
const server = require('./server');
const { Schools, Audiences, Lectures } = require('./models');
const { log } = require('./utils');

async function down() {
    await Promise.all([
        Schools.remove({}),
        Audiences.remove({}),
        Lectures.remove({})
    ]);

    log.red('* Таблицы: Schools, Audiences, Lectures - очищены');
}

async function up() {
    const [createdSchools, createdAudiences] = await Promise.all([
        Schools.create([
            { name: 'Школа разработки интерфейсов', studentsCount: 30 },
            { name: 'Школа мобильной разработки', studentsCount: 32 },
            { name: 'Школа мобильного дизайна', studentsCount: 24 }
        ]),
        Audiences.create([
            { name: 'Экстрополис', capacity: 68, location: 'Главный корпус, 7 этаж' },
            { name: 'Синий кит', capacity: 62, location: 'Главный корпус, 6 этаж' },
            { name: 'Мулен Руж', capacity: 67, location: 'Главный корпус, 5 этаж' },
            { name: 'Меркатор', capacity: 73, location: 'Главный корпус, 1 этаж' }
        ])
    ]);
    await Lectures.create([
        { name: 'Лекция 1. Адаптивная вёрстка', schools: [createdSchools[0].id], lecturers: ['Дмитрий Душкин'], audience: createdAudiences[0].id, startTime: '10-20-16 16:00', endTime: '10-20-16 17:20' },
        { name: 'Лекция 2. Работа с сенсорным пользовательским вводом', schools: [createdSchools[0].id], lecturers: ['Дмитрий Душкин'], audience: createdAudiences[0].id, startTime: '10-27-16 14:00', endTime: '10-27-16 16:00' },
        { name: 'Лекция 3. Мультимедиа: возможности браузера', schools: [createdSchools[0].id], lecturers: ['Максим Васильев'], audience: createdAudiences[1].id, startTime: '11-03-16 16:20', endTime: '11-03-16 18:30' },
        { name: 'Лекция 4. Нативные приложения на веб-технологиях', schools: [createdSchools[0].id, createdSchools[1].id], lecturers: ['Сергей Бережной'], audience: createdAudiences[1].id, startTime: '11-10-17 17:10', endTime: '11-10-17 19:20' },
        { name: 'Лекция 5. Клиентская оптимизация: базовые знания и лучшие практики', schools: [createdSchools[0].id], lecturers: ['Андрей Морозов'], audience: createdAudiences[1].id, startTime: '11-17-17 12:15', endTime: '11-17-17 14:00' },
        { name: 'Лекция 6. Клиентская оптимизация: мобильные устройства и инструменты', schools: [createdSchools[0].id, createdSchools[1].id], lecturers: ['Иван Карев'], audience: createdAudiences[2].id, startTime: '11-24-17 18:00', endTime: '11-24-17 20:00' },
        { name: 'Лекция 7. Инфраструктура веб-проектов', schools: [createdSchools[0].id], lecturers: ['Прокопюк Андрей'], audience: createdAudiences[3].id, startTime: '12-01-17 10:00', endTime: '12-01-17 12:30' },
        { name: 'Лекция 8. Инструменты разработки мобильного фронтенда', schools: [createdSchools[0].id], lecturers: ['Прокопюк Андрей'], audience: createdAudiences[3].id, startTime: '12-10-17 10:30', endTime: '12-10-17 13:00' },
        { name: 'Лекция 1. Java Blitz (Часть 1)', schools: [createdSchools[1].id], lecturers: ['Эдуард Мацуков'], audience: createdAudiences[1].id, startTime: '10-19-17 10:00', endTime: '10-19-17 12:00' },
        { name: 'Лекция 2. Git & Workflow', schools: [createdSchools[1].id], lecturers: ['Дмитрий Складнов'], audience: createdAudiences[1].id, startTime: '10-19-17 13:00', endTime: '10-19-17 15:00' },
        { name: 'Лекция 3. Java Blitz (Часть 2)', schools: [createdSchools[1].id], lecturers: ['Эдуард Мацуков'], audience: createdAudiences[1].id, startTime: '10-25-17 09:00', endTime: '10-25-17 11:00' },
        { name: 'Лекция 4. MyFirstApp (Часть 1)', schools: [createdSchools[1].id], lecturers: ['Роман Григорьев'], audience: createdAudiences[1].id, startTime: '10-25-17 16:00', endTime: '10-25-17 17:30' },
        { name: 'Лекция 5. MyFirstApp (Часть 2)', schools: [createdSchools[1].id], lecturers: ['Роман Григорьев'], audience: createdAudiences[3].id, startTime: '11-02-17 18:00', endTime: '11-02-17 20:20' },
        { name: 'Лекция 6. ViewGroup', schools: [createdSchools[1].id], lecturers: ['Алексей Щербинин'], audience: createdAudiences[3].id, startTime: '11-02-17 15:30', endTime: '11-02-17 16:50' },
        { name: 'Лекция 7. Background', schools: [createdSchools[1].id], lecturers: ['Алексей Макаров'], audience: createdAudiences[3].id, startTime: '11-09-17 14:20', endTime: '11-09-17 17:00' },
        { name: 'Лекция 8. RecyclerView', schools: [createdSchools[1].id], lecturers: ['Владимир Тагаков'], audience: createdAudiences[3].id, startTime: '11-09-17 17:00', endTime: '11-09-17 19:10' },
        { name: 'Лекция 9. Service & Broadcasts', schools: [createdSchools[1].id], lecturers: ['Алексей Макаров'], audience: createdAudiences[2].id, startTime: '11-16-17 14:20', endTime: '11-16-17 15:00' },
        { name: 'Лекция 10. Drawing', schools: [createdSchools[1].id], lecturers: ['Алексей Щербинин'], audience: createdAudiences[2].id, startTime: '11-16-17 17:00', endTime: '11-16-17 18:00' },
        { name: 'Лекция 11. Content provider', schools: [createdSchools[1].id], lecturers: ['Максим Хромцов'], audience: createdAudiences[2].id, startTime: '11-23-17 19:40', endTime: '11-23-17 20:00' },
        { name: 'Лекция 12. SQL&SQLite', schools: [createdSchools[1].id], lecturers: ['Максим Хромцов'], audience: createdAudiences[2].id, startTime: '11-23-17 14:00', endTime: '11-23-17 16:40' },
        { name: 'Лекция 13. Fragments (Часть 1)', schools: [createdSchools[1].id], lecturers: ['Денис Загаевский'], audience: createdAudiences[2].id, startTime: '11-30-17 11:20', endTime: '11-30-17 14:00' },
        { name: 'Лекция 14. Fragments (Часть 2)', schools: [createdSchools[1].id], lecturers: ['Денис Загаевский'], audience: createdAudiences[0].id, startTime: '11-30-17 12:30', endTime: '11-30-17 13:40' },
        { name: 'Лекция 15. MVP&Co', schools: [createdSchools[1].id], lecturers: ['Дмитрий Попов'], audience: createdAudiences[0].id, startTime: '12-07-17 14:00', endTime: '12-07-17 16:00' },
        { name: 'Лекция 16. Debugging & Polishing', schools: [createdSchools[1].id], lecturers: ['Илья Сергеев'], audience: createdAudiences[0].id, startTime: '12-14-17 15:10', endTime: '12-14-17 17:00' },
        { name: 'Лекция 1. Идея, исследование, концепт (Часть 1)', schools: [createdSchools[2].id], lecturers: ['Антон Тен'], audience: createdAudiences[2].id, startTime: '10-18-17 10:00', endTime: '10-18-17 13:30' },
        { name: 'Лекция 2. Идея, исследование, концепт (Часть 2)', schools: [createdSchools[2].id], lecturers: ['Антон Тен'], audience: createdAudiences[2].id, startTime: '10-18-17 12:10', endTime: '10-18-17 14:00' },
        { name: 'Лекция 3. Особенности проектирования мобильных интерфейсов', schools: [createdSchools[0].id, createdSchools[2].id], lecturers: ['Васюнин Николай'], audience: createdAudiences[2].id, startTime: '10-25-17 14:00', endTime: '10-25-17 16:00' },
        { name: 'Лекция 4. Продукт и платформа', schools: [createdSchools[2].id], lecturers: ['Сергей Калабин'], audience: createdAudiences[3].id, startTime: '11-01-17 16:00', endTime: '11-01-17 17:00' },
        { name: 'Лекция 5. Природа операционных систем', schools: [createdSchools[2].id], lecturers: ['Васюнин Николай'], audience: createdAudiences[3].id, startTime: '11-01-17 09:00', endTime: '11-01-17 12:00' },
        { name: 'Лекция 6. Прототипирование как процесс', schools: [createdSchools[2].id], lecturers: ['Сергей Томилов', 'Дарья Старицына'], audience: createdAudiences[3].id, startTime: '11-08-17 15:20', endTime: '11-08-17 17:20' },
        { name: 'Лекция 7. Инструмент под задачи', schools: [createdSchools[2].id], lecturers: ['Сергей Томилов', 'Дарья Старицына'], audience: createdAudiences[2].id, startTime: '11-08-17 18:20', endTime: '11-08-17 20:20' },
        { name: 'Лекция 8. Анимации', schools: [createdSchools[0].id, createdSchools[2].id], lecturers: ['Сергей Томилов', 'Дарья Старицына'], audience: createdAudiences[2].id, startTime: '11-15-17 14:00', endTime: '11-15-17 17:00' },
        { name: 'Лекция 9. Design Everything', schools: [createdSchools[2].id], lecturers: ['Rijshouwer Krijn', 'Treub Jonas'], audience: createdAudiences[0].id, startTime: '11-15-17 18:40', endTime: '11-15-17 19:50' },
        { name: 'Лекция 10. Развите продукта', schools: [createdSchools[2].id], lecturers: ['Андрей Гевак'], audience: createdAudiences[0].id, startTime: '11-22-17 17:00', endTime: '11-22-17 18:30' },
        { name: 'Лекция 11. Исследование интерфейсов', schools: [createdSchools[0].id, createdSchools[2].id], lecturers: ['Кондратьев Александр'], audience: createdAudiences[1].id, startTime: '11-29-17 13:00', endTime: '11-29-17 14:10' },
        { name: 'Лекция 12. Работа в команде', schools: [createdSchools[2].id], lecturers: ['Юрий Подорожный'], audience: createdAudiences[1].id, startTime: '12-06-17 13:00', endTime: '12-06-17 16:20' },
        { name: 'Лекция 13. Айдентика', schools: [createdSchools[2].id], lecturers: ['Дмитрий Моруз', 'Ждан Филиппов'], audience: createdAudiences[1].id, startTime: '12-13-17 10:20', endTime: '12-13-17 12:20' }
    ]);

    log.yellow('* Таблицы: Schools, Audiences, Lectures - заполнены');
}

async function run() {
    await down();
    await up();

    log.green('* Заполнение завершено');
    process.exit(0);
}

run();
