import {Component, h} from 'preact';
import {route} from 'preact-router';
import {connect} from "unistore/preact";

import style from '../style';
import TaskList from './TaskList';
import {getAllTasks} from '../../network/db';
import {addFinishedTask} from '../../store';

interface ITasksScreenProps {
    path: string;
    room: string;
    tasks: ITask[];
    addFinishedTask: any;
}

const TasksContainer: any = style('div')({
    padding: '0 1em'
});

class TasksScreen extends Component<ITasksScreenProps> {
    componentWillMount() {
        getAllTasks();
    }

    onClickBack = () => route('/rooms');

    render() {
        const {tasks, room} = this.props;
        const roomTasks     = tasks.filter(t => t.room === room);

        return (
            <TasksContainer>
                <h2>{room}</h2>
                <TaskList
                    updateTasks={getAllTasks}
                    addFinishedTask={this.props.addFinishedTask}
                    name="Quick clean"
                    tasks={roomTasks.filter(t => !t.isDeep)}
                />
                <TaskList
                    updateTasks={getAllTasks}
                    addFinishedTask={this.props.addFinishedTask}
                    name="Deep clean"
                    tasks={roomTasks.filter(t => t.isDeep)}
                />
            </TasksContainer>
        );
    }
}

export default connect<ITasksScreenProps, {}, {}, {}>
('tasks', {addFinishedTask})(TasksScreen) as any;
