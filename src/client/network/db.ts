import store, {setIsFetching} from '../store/index';

const ORIGIN = 'https://freshdb.herokuapp.com';

const setIsNotFetching = () => setIsFetching(false);

const fetchFromDB = (path, options = {headers: {}}, shouldNotAuth?: boolean) => {
    setIsFetching(true);

    if (!shouldNotAuth) {
        let {username, password} = store.getState();

        if (username && password) {
            options.headers['x-username'] = username.toLowerCase();
            options.headers['x-password'] = password;
        } else {
            return Promise.reject();
        }
    }

    return fetch(`${ORIGIN}${path}`, options)
        .finally(setIsNotFetching);
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

export function undoTask({_id, history}: ITask) {
    const options = {
        method:  'POST',
        headers: {'Content-Type': 'application/json'},
        body:    JSON.stringify({
            history:         history.slice(1),
            userLastCleaned: history[0].userLastCleaned,
            timeLastCleaned: history[0].timeLastCleaned
        })
    };

    return fetchFromDB(`/tasks/${_id}`, options);
}

export function finishTask({_id, history, timeLastCleaned, userLastCleaned}: ITask) {
    const newTimeLastCleaned = Date.now();

    const options = {
        method:  'POST',
        headers: {'Content-Type': 'application/json'},
        body:    JSON.stringify({
            history:         [
                {timeLastCleaned, userLastCleaned},
                ...history
            ],
            timeLastCleaned: newTimeLastCleaned,
            userLastCleaned: store.getState().username
        })
    };

    return fetchFromDB(`/tasks/${_id}`, options);
}
