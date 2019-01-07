import {Component, h} from 'preact';
import style from '../style';
import {route} from 'preact-router';
import TaskList from './TaskList';
import {getAllTasks} from '../../network/db';
import {connect} from "unistore/preact";
import {setTasks} from '../../store';

interface ITasksScreenProps {
    path: string;
    room: string;
    tasks: ITask[];
    setTasks: any;
}

const TasksContainer: any = style('div')({
    padding: '0 1em'
});

class TasksScreen extends Component<ITasksScreenProps> {
    componentWillMount() {
        this.updateTasks();
    }

    updateTasks = () => getAllTasks().then(this.props.setTasks);

    onClickBack = () => route('/rooms');

    render() {
        const {tasks, room} = this.props;
        const roomTasks     = tasks.filter(t => t.room === room);

        return (
            <TasksContainer>
                <h2>{room}</h2>
                <TaskList parent={this} name="Quick clean" tasks={roomTasks.filter(t => !t.isDeep)}/>
                <TaskList parent={this} name="Deep clean" tasks={roomTasks.filter(t => t.isDeep)}/>
            </TasksContainer>
        );
    }
}

export default connect<ITasksScreenProps, {}, {}, {}>
('tasks', {setTasks})(
    TasksScreen
) as any;
