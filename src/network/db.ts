import store from '../store';

const ORIGIN = 'https://freshdb.herokuapp.com';

const fetchFromDB = (path, options = {headers: {}}, shouldNotAuth?: boolean) => {
    if (!shouldNotAuth) {
        let {username, password} = store.getState();

        if (username && password) {
            options.headers['x-username'] = username.toLowerCase();
            options.headers['x-password'] = password;
        } else {
            return Promise.reject();
        }
    }

    return fetch(`${ORIGIN}${path}`, options);
};

const getErrorOrJSON = res => {
    if (res.status === 200) {
        return res.json();
    } else {
        throw new Error(res.message);
    }
};

export function getAllUsers() {
    return fetchFromDB('/users', undefined, true)
        .then(getErrorOrJSON);
}

export function getAllRooms() {
    return fetchFromDB('/rooms')
        .then(getErrorOrJSON);
}

export function getAllTasks() {
    return fetchFromDB('/tasks')
        .then(getErrorOrJSON)
        .then(tasks => tasks.sort((a, b) => a.timeLastCleaned - b.timeLastCleaned));
}

export function finishTask(id) {
    const timeLastCleaned = Date.now();

    const options = {
        method:  'POST',
        headers: {'Content-Type': 'application/json'},
        body:    JSON.stringify({
            timeLastCleaned,
            userLastCleaned: store.getState().username
        })
    };

    return fetchFromDB(`/tasks/${id}`, options);
}
