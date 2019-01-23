import {Component, h} from 'preact';
import store from '../../store';
import style from '../style';

const SelectField: any = style('select')({
    'font-size': '1em'
});

class RoomSelect extends Component<{ selected: string, onChange: Function }> {
    render() {
        const {selected, onChange} = this.props;
        const rooms                = store.getState().rooms;

        return <SelectField onChange={onChange}>
            {rooms.map(({name}) => {
                const props: any = {value: name};
                if (selected === name) {
                    props.selected = 'selected';
                }

                return <option {...props}>{name}</option>;
            })}
        </SelectField>;
    }
}

export const getFormattedTaskValue = (value, keyName: string, onChange: Function) => {
    if (typeof value === 'boolean') {
        return value ? 'Y' : 'N';
    } else {
        if (keyName === 'room') {
            return <RoomSelect selected={value} onChange={onChange}/>;
        } else {
            return value;
        }
    }
};
