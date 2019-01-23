import store, {setIsFetching, setRooms, setTasks, setUsers} from '../store';

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
        .then(getErrorOrJSON)
        .then(setUsers);
}

export function getAllRooms() {
    return fetchFromDB('/rooms')
        .then(getErrorOrJSON)
        .then(setRooms);
}

export function getAllTasks() {
    return fetchFromDB('/tasks')
        .then(getErrorOrJSON)
        .then(tasks => tasks.sort((a, b) => a.timeLastCleaned - b.timeLastCleaned))
        .then(setTasks);
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

// Admin operations

// Fix for MongoError 66: delete ._id
// Performing an update on the path '_id' would modify the immutable field '_id'

export function createTaskAdmin() {
    const options = {
        method:  'POST',
        headers: {'Content-Type': 'application/json'},
        body:    '{}'
    };

    return fetchFromDB('/tasks', options);
}

export function destroyTaskAdmin({_id}: ITask) {
    const options = {method: 'DELETE', headers: {}};

    return fetchFromDB(`/tasks/${_id}`, options);
}

export function updateTaskAdmin(task: Partial<ITask>) {
    const {_id} = task;

    const updatedTask = {...task};
    delete updatedTask._id;

    const options = {
        method:  'POST',
        headers: {'Content-Type': 'application/json'},
        body:    JSON.stringify(updatedTask)
    };

    return fetchFromDB(`/tasks/${_id}`, options);
}
