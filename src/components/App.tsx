import {h} from 'preact';
import Router from 'preact-router';
import createHashHistory from 'history/createHashHistory';

import LoginScreen from './LoginScreen';
import TasksScreen from './TasksScreen';
import RoomsScreen from './RoomsScreen';
import Header from './Header';
import store from '../store';

function onChange({url}) {
    store.setState({route: url.slice(1)});
}

export default () => (
    <div>
        <Header/>
        <Router history={createHashHistory()} onChange={onChange}>
            <LoginScreen default/>
            <TasksScreen path="/clean/:room"/>
            <RoomsScreen path="/rooms"/>
        </Router>
    </div>
);
