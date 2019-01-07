import {Component, h} from 'preact';
import {connect} from 'unistore/preact'

import style, {common} from './style';
import {Color} from './colors';
import {route} from 'preact-router';
import {clearState} from '../store';

const HEADER_HEIGHT = '3em';

const HeaderContainer: any = style('div')({
    display: 'block',
    width:   '100%',
    height:  HEADER_HEIGHT
});

const Header: any = style('div')({
    position:   'fixed',
    top:        0,
    left:       0,
    display:    'block',
    width:      '100%',
    background: Color.Blue1,
    height:     HEADER_HEIGHT
});

const AuthButton: any = style('div')({
    ...common.button,
    display:       'inline-block',
    height:        '100%',
    background:    Color.Blue0,
    float:         'right',
    padding:       '0 1em',
    'line-height': HEADER_HEIGHT
});

const BackButton: any = style('div')({
    ...common.button,
    display:       'inline-block',
    height:        '100%',
    background:    Color.Blue0,
    padding:       '0 1em',
    'line-height': HEADER_HEIGHT
});

const LoggedInAsUser: any = style('span')({
    'margin-left': '1em'
});

const Title: any = style('span')({
    'line-height':  HEADER_HEIGHT,
    'padding-left': '1em',
    'font-style':   'italic'
});

interface IUnconnectedHeaderProps {
    history: any;
    route: string;
    username: string | null;
    clearState: Function;
}

const ROUTES_SIGNOUT_BUTTON = /\/rooms/;

class UnconnectedHeader extends Component<IUnconnectedHeaderProps> {
    onClickBack    = () => history.back();
    onClickSignOut = () => {
        this.props.clearState();
        route('/');
    };

    render() {
        const {route, username} = this.props;

        let authButton;
        if (username && ROUTES_SIGNOUT_BUTTON.test(location.hash.slice(1))) {
            authButton = <AuthButton onClick={this.onClickSignOut}>Sign out</AuthButton>;
        }

        let backButton;
        if (/^clean/.test(route)) {
            backButton = <BackButton onClick={this.onClickBack}>⬅️</BackButton>;
        }

        return (
            <HeaderContainer>
                <Header>
                    {backButton}
                    <Title title={process.env.BUILD_DATE}>Fresh!</Title>
                    {username ?
                        <LoggedInAsUser>Signed in as {username}</LoggedInAsUser> :
                        <LoggedInAsUser>Welcome, let's get it cleaned up!</LoggedInAsUser>
                    }
                    {authButton}
                </Header>
            </HeaderContainer>
        );
    }
}

export default connect<IUnconnectedHeaderProps, {}, {}, {}>('username,route', {clearState})
(UnconnectedHeader) as any;
