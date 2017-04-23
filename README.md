# Задание 2

Библиотека, предоставляющая (REST) API для работы с расписанием лекций из первого задания.

### Данная библиотека гарантирует корректность и связанность следующих данных

* Не может быть двух школ с одинаковым названием.
* Не может быть двух аудиторий с одинаковым названием.
* Нельзя добавить лекцию для несуществующей школы или аудитории.
* Для одной школы не может быть двух лекций одновременно.
* В одной аудитории не может быть одновременно двух разных лекций.
* Вместимость аудитории должна быть больше или равной количеству студентов на лекции.

### Реализовано следующее

* MongoDB – в качестве базы для постоянного хранения данных.
* mLab – в качестве сервиса для размещения базы данных.
* Веб–интерфейс для работы со всеми ресурсами, доступный по http://localhost:8080
* Покрытие тестами REST ресурсов.

### Рекомендации

* Node.js версии >=7.6.0, для корректной работы async / await

### Недостатки веб–интерфейса

* Весь клиентский javascript транспилится через babel в браузере.
* В фильтрах используется нативный компонент даты (поддерживается не во всех браузерах).
* При добавлении / редактировании записи отсутствует компонент даты + времени.

### Ресурсы

* [Школы](#Школы)
* [Аудитории](#Аудитории)
* [Лекции](#Лекции)

## Школы

### Модель – schools
| Название      | Тип             | Описание                     | Обязательно  | Знач. по умолч.
| ------------- | --------------- | ---------------------------- | ------------ | ---------------
| name          | String – unique | Название школы               | да           |                
| studentsCount | Number          | Количество студентов в школе | нет          | 0              

### Получение расписания школы в заданный интервал дат
```shell
$ curl -X GET \
  http://localhost:8080/api/v1/schools/<schoolID>/lectures[?start=MM-DD-YYYY[&end=MM-DD-YYYY]]
```

### Получение списка школ
```shell
$ curl -X GET \
  http://localhost:8080/api/v1/schools
```

### Добавление школы
```shell
$ curl -X POST \
  http://localhost:8080/api/v1/schools \
  -H 'Content-Type: application/json' \
  -d '{ "name": "", "studentsCount": "" }'
```

### Обновление школы
```shell
$ curl -X PUT \
  http://localhost:8080/api/v1/schools/<schoolID> \
  -H 'Content-Type: application/json' \
  -d '{ "name": "", "studentsCount": "" }'
```

### Удаление школы
```shell
$ curl -X DELETE \
  http://localhost:8080/api/v1/schools/<schoolID>
```

## Аудитории

### Модель – audiences
| Название      | Тип             | Описание               | Обязательно  | Знач. по умолч.
| ------------- | --------------- | ---------------------- | ------------ | ---------------
| name          | String – unique | Название аудитории     | да           |                
| capacity      | Number          | Вместимость аудитории  | нет          | 0              
| location      | String          | Расположение аудитории | да           |                

### Просмотр графика лекций в аудитории, в заданный интервал дат
```shell
$ curl -X GET \
  http://localhost:8080/api/v1/audiences/<audienceID>/lectures[?start=MM-DD-YYYY[&end=MM-DD-YYYY]]
```

### Получение списка аудиторий
```shell
$ curl -X GET \
  http://localhost:8080/api/v1/audiences
```

### Добавление аудитории
```shell
$ curl -X POST \
  http://localhost:8080/api/v1/audiences \
  -H 'Content-Type: application/json' \
  -d '{ "name": "", "capacity": "", "location": "" }'
```

### Обновление аудитории
```shell
$ curl -X PUT \
  http://localhost:8080/api/v1/audiences/<audienceID> \
  -H 'Content-Type: application/json' \
  -d '{ "name": "", "capacity": "", "location": "" }'
```

### Удаление аудитории
```shell
$ curl -X DELETE \
  http://localhost:8080/api/v1/audiences/<audienceID>
```

## Лекции

### Модель – lectures
| Название      | Тип              | Описание                         | Обязательно  | Знач. по умолч.
| ------------- | ---------------- | -------------------------------- | ------------ | ---------------
| name          | String – unique  | Название лекции                  | да           |                
| schools       | Array [ObjectId] | ID's школ                        | да           |                
| lecturers     | Array            | Лектора                          | да           |                
| audience      | ObjectId         | ID аудитории                     | да           |                
| startTime     | Number           | Начало лекции (MM-DD-YYYY HH:mm) | да           |                
| endTime       | Number           | Конец лекции (MM-DD-YYYY HH:mm)  | да           |                

### Получение списка лекций
```shell
$ curl -X GET \
  http://localhost:8080/api/v1/lectures
```

### Добавление лекции
```shell
$ curl -X POST \
  http://localhost:8080/api/v1/lectures \
  -H 'Content-Type: application/json' \
  -d '{ "name": "", "schools": [], "lecturers": [], "audience": "", "startTime": "", "endTime": "" }'
```

### Обновление лекции
```shell
$ curl -X PUT \
  http://localhost:8080/api/v1/lectures/<lectureID> \
  -H 'Content-Type: application/json' \
  -d '{ "name": "", "schools": [], "lecturers": [], "audience": "", "startTime": "", "endTime": "" }'
```

### Удаление лекции
```shell
$ curl -X DELETE \
  http://localhost:8080/api/v1/lectures/<lectureID>
```

## Ошибки

### Пример описания ошибки
```json
{
    "code": "400",
    "errors": [
        { "field": "fieldName", "message": "error message", "value": "entered value" }
    ]
}
```

## Команды

### Установка зависимостей
```shell
$ npm i -progress=false
```

### Наполнение данными
```shell
$ npm run seeding
```

### Запуск проекта в режиме разработки
```shell
$ npm run dev
```

### Запуск проекта в режиме продакшена
```shell
$ npm run prod
```

### Тестирование REST ресурсов
```shell
$ npm run test
```

### Проверка кода
```shell
$ npm run lint
```
