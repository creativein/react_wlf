import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import {createStore} from 'redux'
import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker';

// a "reducer" that handle some events and return a state
function counter(state = 0, action) {
    return action.type === 'INCREMENT' ? state + 1
        : action.type === 'DECREMENT' ? state - 1
        : state;
}

let store = createStore(counter);

store.subscribe(() =>
    console.log(store.getState())
);

store.dispatch({type: 'INCREMENT'}) // 1
store.dispatch({type: 'INCREMENT'}) // 2
store.dispatch({type: 'DECREMENT'}) // 1

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));
registerServiceWorker();
