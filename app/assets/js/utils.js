const isEmptyObject = (object) => !Object.keys(object).length;

const normalizeDate = (date) => date.replace(/\s/, ' в ');

const objectsEquals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const fillArray = (length) => Array.from(new Array(length), (v, i) => i);

const getFormData = (form) => {
    return Array.from(form).reduce((acc, element) => {
        if (element.matches('input')) {
            acc[element.name] = element.value;
        }

        return acc;
    }, {});
};

const normalizeErrors = (errors) => {
    return errors.reduce((acc, error) => {
        acc[error.field] = {
            message: error.message,
            value: error.value
        };

        return acc;
    }, {});
};

const normalizeSelect = (select) => {
    return Object.keys(select).reduce((acc, key) => {
        if (select[key]) {
            if (key === 'audience') {
                acc[key] = select[key].id;
            } else if (key === 'schools') {
                acc[key] = select[key].map((school) => school.id);
            } else {
                acc[key] = select[key];
            }
        }

        return acc;
    }, {});
};

const declineOfPeople = (count) => {
    const cases = [2, 0, 1, 1, 1, 2];
    const titles = ['человек', 'человека', 'человек'];
    const index = ((count % 100 > 4) && (count % 100 < 20)) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5];

    return titles[index];
};
