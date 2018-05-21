import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import apiMiddleware from '../middleware/api';
import rootReducer from '../reducers';

const configStore = preloadedState =>
  createStore(rootReducer, preloadedState, applyMiddleware(thunk, apiMiddleware));

export default configStore;
