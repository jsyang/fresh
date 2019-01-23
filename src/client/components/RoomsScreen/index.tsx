import {Component, h} from 'preact';
import {route} from 'preact-router';
import {connect} from "unistore/preact";

import style, {common} from '../style';
import {Color} from '../colors';
import {getAllRooms} from '../../network/db';
import {clearState} from '../../store';

const Button: any = style('button')({
    ...common.button,
    display:     'block',
    padding:     '0.5em',
    'min-width': '75%',
    margin:      '0.5em auto',
    'font-size': '2em',
    background:  Color.Blue0
});

interface IRoomsScreenProps {
    rooms: any[];
}

class RoomsScreen extends Component<IRoomsScreenProps> {
    componentWillMount() {
        getAllRooms()
            .catch(() => {
                clearState();
                route('/');
            });
    }

    onClick = room => route(`/clean/${room}`);

    render() {
        const {rooms} = this.props;

        if (rooms.length > 0) {
            return (
                <div>
                    {rooms.map(({name}) => (
                        <Button onClick={this.onClick.bind(null, name)}>{name}</Button>
                    ))}
                </div>
            );
        } else {
            return 'Loading rooms...';
        }
    }
}

export default connect<IRoomsScreenProps, {}, {}, {}>
('rooms')(RoomsScreen) as any;