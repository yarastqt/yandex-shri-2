function queryBuilder(queryObject) {
    return Object.keys(queryObject).map((key) => {
        if (queryObject[key]) {
            return `${key}=${queryObject[key]}`;
        }
    }).filter((value) => value).join('&');
}

function getHeaders() {
    return {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };
}

function parseJSON(response) {
    return response.json();
}

function request(url, queryObject, options) {
    const query = queryBuilder(queryObject);
    const headers = getHeaders();
    const advancedOptions = { ...options, headers };
    let endPoint = null;

    if (query) {
        endPoint = `${url}?${query}`;
    } else {
        endPoint = url;
    }

    return new Promise((resolve, reject) => {
        fetch(endPoint, advancedOptions)
            .then((response) => {
                if (response.ok) {
                    parseJSON(response).then((res) => resolve(res));
                } else {
                    parseJSON(response).then((res) => reject(res));
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const http = {
    get(url, query = {}) {
        return request(url, query);
    },

    post(url, data) {
        return request(url, {}, {
            method: 'post',
            body: JSON.stringify(data)
        });
    },

    put(url, data) {
        return request(url, {}, {
            method: 'put',
            body: JSON.stringify(data)
        });
    },

    delete(url) {
        return request(url, {}, {
            method: 'delete'
        });
    }
};
