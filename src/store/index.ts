import createStore from 'unistore';

export interface IState {
    username: string | null;
    password: string | null;
    route: string;

    // Locally cached data from network
    users: any[];
    tasks: any[];
    rooms: any[];
}

const DEFAULT_STATE: IState = {
    username: null,
    password: null,
    route:    '/',
    users:    [],
    tasks:    [],
    rooms:    []
};

const persistedState = localStorage.getItem('state');

const store = createStore(persistedState ? JSON.parse(persistedState) : DEFAULT_STATE);

// Persist to local storage
store.subscribe(state => localStorage.setItem('state', JSON.stringify(state)));

export default store;

// Local actions

export const setUsernamePassword = (state: IState, username: string, password: string): IState =>
    ({...state, password, username});

export const clearState = () => store.setState(DEFAULT_STATE);

// From network

export const setUsers = (state: IState, users: any[]): IState =>
    ({...state, users});

export const setRooms = (state: IState, rooms: any[]): IState =>
    ({...state, rooms});

export const setTasks = (state: IState, tasks: any[]): IState =>
    ({...state, tasks});

