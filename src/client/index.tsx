import {shim} from 'promise.prototype.finally';
shim();

import {Provider} from 'unistore/preact'
import {h, render} from 'preact';
import App from './components/App';
import store from './store';


render(<Provider store={store}><App/></Provider>, document.body);