import {Component, h} from 'preact';

import style from '../style';
import {Color} from '../colors';
import TableRow from './TableRow';
import {createTaskAdmin, getAllTasks} from '../../network/db';

const AddRow: any = style('td')({
    background:   Color.Gray2,
    padding:      '1em',
    opacity:      0.8,
    'text-align': 'center',
    cursor:       'pointer',
    transition:   'all 0.3s ease',
    ':hover':     {
        background: Color.Gray0,
        color:      Color.Gray2
    }
});

const TableHeader: any = style('th')({
    background: Color.Gray1,
    padding:    '0.5em'
});

const Table: any = style('table')({
    margin:            '5%',
    padding:           '0.5em',
    width:             '90%',
    'border-collapse': 'collapse'
});

export const getRelevantTaskFields = k => /room|name|description|isDeep/g.test(k);

const byRoom = (a, b) => a.room.toLowerCase() < b.room.toLowerCase() ? -1 : 1;

export default class SpreadSheet extends Component<{ data: any[] }> {
    onClickAdd = () => createTaskAdmin().then(getAllTasks);

    render() {
        const {data}     = this.props;
        const headerKeys = Object.keys(data[0]).filter(getRelevantTaskFields);

        return (
            <Table>
                <tr>
                    {headerKeys.map(heading => <TableHeader>{heading}</TableHeader>)}
                    <TableHeader>Delete</TableHeader>
                </tr>
                {data.sort(byRoom).map(row => <TableRow row={row} headerKeys={headerKeys}/>)}
                <tr>
                    <AddRow colSpan={headerKeys.length + 1} onClick={this.onClickAdd}>Add new row</AddRow>
                </tr>
            </Table>
        )
    }
}