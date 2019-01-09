import {h} from 'preact';
import Router from 'preact-router';
import createHashHistory from 'history/createHashHistory';

import LoginScreen from './LoginScreen/index';
import TasksScreen from './TasksScreen/index';
import RoomsScreen from './RoomsScreen/index';
import Header from './Header';
import store from '../store/index';

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
