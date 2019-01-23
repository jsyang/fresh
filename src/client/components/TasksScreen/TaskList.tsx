import {Component, h} from 'preact';

import style from '../style';
import {getIsOverDue, getRelativeHumanString} from '../../time';
import {Color, getBackgroundColorByTime, getTextColorByTime} from '../colors';
import {finishTask} from '../../network/db';

interface ITaskListProps {
    updateTasks: any;
    addFinishedTask: Function;
    tasks: any[];
    name: string;
}

const ListTable: any = style('table')({
    width:             '100%',
    'border-collapse': 'collapse'
});

const padding = '0.25em';

const FinishButton: any = style('th')({
    background:   Color.Blue1,
    color:        Color.Blue0,
    'font-size':  '1.8em',
    padding,
    'text-align': 'center'
});

const Name: any = style('td')({
    'font-size':   '1em',
    'font-weight': 'bold',
    'max-width':   '50%',
    padding
});

const TimeLastCleaned: any = style('td')({
    'font-size':  '1em',
    'text-align': 'right',
    'min-width':  '6em',
    padding
});

const UserLastCleaned: any = style('td')({
    'font-size':  '1em',
    'text-align': 'right',
    'font-style': 'italic',
    width:        '3em',
    padding
});

const TaskRow: any = style('tr')({
    'th': {
        'border-top': `1px solid ${Color.Blue0}`
    }
});

class TaskList extends Component<ITaskListProps> {
    onClickFinish = (t: ITask) =>
        finishTask(t)
            .then(this.props.updateTasks)
            .then(() => this.props.addFinishedTask(t));

    onClickName = (t: ITask) => {
        if (t.description) {
            alert(`More info:\n${t.description}`);
        }
    };

    getTaskRow = (t: ITask) => (
        <TaskRow style={{
            animation:  getIsOverDue(t.timeLastCleaned) ? 'blink 2s infinite steps(1)' : '',
            background: getBackgroundColorByTime(t.timeLastCleaned),
            color:      getTextColorByTime(t.timeLastCleaned)
        }}>
            <FinishButton onClick={() => this.onClickFinish(t)}>✕</FinishButton>
            <Name onClick={() => this.onClickName(t)}>{t.name}</Name>
            <TimeLastCleaned>{getRelativeHumanString(t.timeLastCleaned)} ago</TimeLastCleaned>
            <UserLastCleaned>{t.userLastCleaned}</UserLastCleaned>
        </TaskRow>
    );

    render() {
        const {tasks, name} = this.props;

        return (
            <div>
                <h3>{name} - {tasks.length} tasks</h3>
                <ListTable>{tasks.map(this.getTaskRow)}</ListTable>
            </div>
        );
    }
}

export default TaskList;
