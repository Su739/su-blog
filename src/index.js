import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import configStore from './store/configStore';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const store = configStore();

// eslint-disable-next-line no-undef
ReactDOM.render(<Root store={store} />, document.getElementById('main'));
registerServiceWorker();
