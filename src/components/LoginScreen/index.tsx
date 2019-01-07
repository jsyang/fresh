import {h, Component} from 'preact';
import style, {common} from '../style';
import {route} from 'preact-router';
import {connect} from 'unistore/preact';
import {setUsernamePassword, setUsers} from '../../store';
import {Color} from '../colors';
import {getAllUsers} from '../../network/db';

const Button: any = style('div')({
    ...common.button,
    background:  Color.Green0,
    display:     'block',
    'font-size': '2em',
    padding:     '0.5em',
    margin:      '0.5em auto'
});


interface ILoginScreenProps {
    username: string | null;
    setUsers: Function;
    setUsernamePassword: Function;
    users: any[];
}

class LoginScreen extends Component<ILoginScreenProps> {
    componentWillMount() {
        if (this.props.username) {
            route('rooms', true);
        }

        if (this.props.users.length === 0) {
            getAllUsers().then(this.props.setUsers as any);
        }
    }

    onClickUser = ({currentTarget}) => {
        const username = currentTarget.innerText;
        const password = prompt('Enter password', '');

        if (password) {
            this.props.setUsernamePassword(username, password);
            route('rooms');
        } else {
            alert('Cannot continue! No password was given!');
        }
    };

    render() {
        const {users} = this.props;

        if (users.length > 0) {
            return (
                <div>
                    {users.map(({name}) => (
                        <Button onClick={this.onClickUser}>{name}</Button>
                    ))}
                </div>
            );
        } else {
            return 'Loading users...';
        }
    }
}

export default connect<ILoginScreenProps, {}, {}, {}>
('users,username', {setUsernamePassword, setUsers})(
    LoginScreen
) as any;
