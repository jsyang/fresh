import {Component, h} from 'preact';
import debounce from 'lodash.debounce';

import style from '../style';
import {Color} from '../colors';
import {getFormattedTaskValue} from './RoomSelect';
import {getRelevantTaskFields} from './SpreadSheet';
import {destroyTaskAdmin, getAllTasks, updateTaskAdmin} from '../../network/db';

const TableCell: any = style('td')({
    border:  `1px solid ${Color.Gray1}`,
    padding: '0.25em'
});

const getRelevantTaskFieldValues = task => Object.keys(task).filter(getRelevantTaskFields).map(key => task[key]);

export default class TableRow extends Component<{ row: any, headerKeys: string[] }> {
    onClickDelete = () => destroyTaskAdmin(this.props.row)
        .then(getAllTasks);

    onChange = () => {
        const {row} = this.props;

        const newRow: Partial<ITask> = {_id: row._id};

        Array.from(document.getElementById(row._id)!.querySelectorAll('[data-key]'))
            .forEach(fieldEl => {
                const key = fieldEl.getAttribute('data-key')!;

                let newValue;
                const textContent = fieldEl.firstChild!.textContent!.trim();

                switch (key) {
                    case'room':
                        newValue = (fieldEl.firstChild as any).value;
                        break;
                    case'isDeep':
                        newValue = textContent.toUpperCase() === 'Y';
                        break;
                    default:
                        newValue = textContent;
                        break;
                }

                newRow[key] = newValue;
            });

        updateTaskAdmin(newRow)
            .then(() => console.log('saved!'));
    };

    onChangeDebounced = debounce(this.onChange, 750);

    render() {
        const {row, headerKeys} = this.props;

        return <tr id={row._id}>
            {getRelevantTaskFieldValues(row).map((value, i) =>
                <TableCell
                    contenteditable={headerKeys[i] !== 'room'}
                    onBlur={this.onChangeDebounced}
                    onKeyUp={this.onChangeDebounced}
                    data-key={headerKeys[i]}
                >
                    {getFormattedTaskValue(value, headerKeys[i], this.onChangeDebounced)}
                </TableCell>
            )}
            <TableCell onClick={this.onClickDelete} style="cursor:pointer; text-align:center">❌</TableCell>
        </tr>;
    }
}