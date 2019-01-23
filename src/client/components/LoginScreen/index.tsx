import {h, Component} from 'preact';
import {route} from 'preact-router';
import {connect} from 'unistore/preact';

import style, {common} from '../style';
import {setUsernamePassword} from '../../store';
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
    setUsernamePassword: Function;
    users: any[];
}

class LoginScreen extends Component<ILoginScreenProps> {
    componentWillMount() {
        if (this.props.username) {
            route('rooms', true);
        }

        if (this.props.users.length === 0) {
            getAllUsers();
        }
    }

    onClickUser = ({currentTarget}) => {
        const username = currentTarget.innerText;
        const password = prompt('Enter password', '');

        if (password) {
            this.props.setUsernamePassword(username, password);

            if (username === 'Admin') {
                route('admin');
            } else {
                route('rooms');
            }
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
                        <Button
                            onClick={this.onClickUser}
                            style={name === 'Admin' ? `background: ${Color.Red0}` : ''}
                        >
                            {name}
                        </Button>
                    ))}
                </div>
            );
        } else {
            return 'Loading users...';
        }
    }
}

export default connect<ILoginScreenProps, {}, {}, {}>
('users,username', {setUsernamePassword})(LoginScreen) as any;
