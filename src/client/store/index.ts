import createStore from 'unistore';

export interface IState {
    username: string | null;
    password: string | null;
    route: string;
    lastFinishedTasks: any[]; // ids only
    isFetching: boolean;

    // Locally cached data from network
    users: any[];
    tasks: ITask[];
    rooms: any[];
}

const DEFAULT_STATE: IState = {
    username:          null,
    password:          null,
    isFetching:        false,
    route:             '/',
    users:             [],
    tasks:             [],
    rooms:             [],
    lastFinishedTasks: []
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

export const addFinishedTask = (state: IState, {_id}: ITask): IState =>
    ({...state, lastFinishedTasks: [_id, ...state.lastFinishedTasks]});

export const undoFinishedTask = (state: IState): IState =>
    ({...state, lastFinishedTasks: state.lastFinishedTasks.slice(1)});

export const setIsFetching = (isFetching: boolean) => store.setState({isFetching});

// From network

export const setUsers = (state: IState, users: any[]): IState =>
    ({...state, users});

export const setRooms = (state: IState, rooms: any[]): IState =>
    ({...state, rooms});

export const setTasks = (state: IState, tasks: any[]): IState =>
    ({...state, tasks});

