import {Component, h} from 'preact';
import {route} from 'preact-router';
import {connect} from 'unistore/preact'

import style, {animation, common} from './style';
import {Color} from './colors';
import {addFinishedTask, clearState, setTasks, undoFinishedTask} from '../store';
import {getAllTasks, undoTask} from '../network/db';

const HEADER_HEIGHT = '3em';

const HeaderContainer: any = style('div')({
    display: 'block',
    width:   '100%',
    height:  HEADER_HEIGHT
});

const Header: any = style('div')({
    position:        'fixed',
    top:             0,
    left:            0,
    display:         'block',
    width:           '100%',
    background:      Color.Blue1,
    height:          HEADER_HEIGHT,
    'border-bottom': `1px solid ${Color.Blue2}`
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

const UndoButton: any = style('div')({
    ...common.button,
    float:         'right',
    display:       'inline-block',
    height:        '100%',
    background:    Color.Blue2,
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

const spinning: any = animation({
    '0%':   {transform: 'translate(-50%,-50%) rotate(0deg)'},
    '100%': {transform: 'translate(-50%,-50%) rotate(360deg)'}
});

const LoadingSpinner: any = style('div')({
    position:   'fixed',
    top:        '0',
    left:       '0',
    right:      '0',
    bottom:     '0',
    background: 'rgba(255,255,255,0.8)',
    ':before':  {
        display:         'block',
        content:         '" "',
        animation:       `${spinning} 0.5s infinite linear`,
        position:        'absolute',
        top:             '50%',
        left:            '50%',
        border:          `2em dashed ${Color.Blue2}`,
        'border-radius': '6em',
        width:           '6em',
        height:          '6em'
    }
});

interface IUnconnectedHeaderProps {
    history: any;
    lastFinishedTasks: string[];
    tasks: ITask[];
    route: string;
    isFetching: boolean;
    username: string | null;
    clearState: Function;
    undoFinishedTask: any;
    addFinishedTask: Function;
    setTasks: any;
}

const ROUTES_SIGNOUT_BUTTON = /\/rooms|\/admin/;

class UnconnectedHeader extends Component<IUnconnectedHeaderProps> {
    onClickBack    = () => history.back();
    onClickUndo    = () => {
        const lastTask = this.props.tasks.find(t => t._id === this.props.lastFinishedTasks[0]);

        if (lastTask) {
            undoTask(lastTask)
                .then(this.props.undoFinishedTask)
                .then(getAllTasks)
                .then(this.props.setTasks);
        }
    };
    onClickSignOut = () => {
        this.props.clearState();
        route('/');
    };

    render() {
        const {route, username, isFetching} = this.props;

        let authButton;
        if (username && ROUTES_SIGNOUT_BUTTON.test(location.hash.slice(1))) {
            authButton = <AuthButton onClick={this.onClickSignOut}>Sign out</AuthButton>;
        }

        let backButton;
        let undoButton;
        if (/^clean/.test(route)) {
            backButton = <BackButton onClick={this.onClickBack}>⬅</BackButton>;
            undoButton = <UndoButton onClick={this.onClickUndo}>⟲</UndoButton>
        }

        return (
            <HeaderContainer>
                <Header style="z-index:9001">
                    {backButton}
                    <Title title={process.env.BUILD_DATE}>Fresh!</Title>
                    {username ?
                        <LoggedInAsUser>Signed in as {username}</LoggedInAsUser> :
                        <LoggedInAsUser>Welcome, let's get it cleaned up!</LoggedInAsUser>
                    }
                    {authButton}
                    {undoButton}
                </Header>
                {isFetching && <LoadingSpinner style="z-index:9002"/>}
            </HeaderContainer>
        );
    }
}

export default connect<IUnconnectedHeaderProps, {}, {}, {}>('isFetching,tasks,lastFinishedTasks,username,route', {
    clearState,
    undoFinishedTask,
    addFinishedTask,
    setTasks
})
(UnconnectedHeader) as any;
