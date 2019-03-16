import {Component, h} from 'preact';
import {route} from 'preact-router';
import {connect} from "unistore/preact";

import {getAllRooms, getAllTasks} from '../../network/db';
import {clearState} from '../../store';
import SpreadSheet from './SpreadSheet';

interface IAdminScreenProps {
    rooms: any[];
    tasks: any[];
}

export class AdminScreen extends Component<IAdminScreenProps> {
    componentDidMount() {
        Promise.all([getAllTasks(), getAllRooms()])
            .catch(() => {
                clearState();
                route('/');
            });
    }

    render() {
        const {rooms, tasks} = this.props;

        if (rooms.length + tasks.length) {
            return <SpreadSheet data={tasks}/>;
        } else {
            return 'Loading rooms and tasks...';
        }
    }
}

export default connect<IAdminScreenProps, {}, {}, {}>
('rooms,tasks')(AdminScreen) as any;