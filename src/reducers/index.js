import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import merge from 'lodash/merge';
import actions from '../actions';

const {
  types: {
    uiTypes, articleTypes, bookTypes, authTypes, userTypes
  }
} = actions;

const auth = (state = { isLogged: true, loginName: null }, action) => {
  if (action.type === authTypes.REFRESH_AUTHENTICATION) {
    return {
      ...state,
      isLogged: action.isLogged,
      loginName: action.loginName
    };
  }
  return state;
};

// Updates an entity cache in response to any action with response.entities.
const entities = (state = { users: {}, books: {}, articles: {} }, action) => {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }

  return state;
};

// Updates an result by normalizd response.result to any action with response.result.
const result = (state = {}, action) => {
  if (action.response && action.response.result) {
    return { ...state, ...action.response.result };
  }

  return state;
};

// #region ui region

// eslint-disable-next-line no-undef
const screen = (state = window.innerWidth, action) => {
  switch (action.type) {
    case uiTypes.SCREEN_RESIZE:
      return action.screenWidth;
    default:
      return state;
  }
};

const navbar = (state = {
  isFetching: false, displayLoginForm: false, displayRegisterForm: false
}, action) => {
  switch (action.type) {
    case uiTypes.TOGGLE_LOGIN_FORM:
      return {
        ...state,
        displayLoginForm: action.displayLoginForm
      };
    case uiTypes.TOGGLE_REGISTER_FORM:
      return {
        ...state,
        displayRegisterForm: action.displayRegisterForm
      };
    case userTypes.USER_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case userTypes.USER_SUCCESS:
    case userTypes.USER_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};

const popwindow = (state = {
  displayLoginForm: false, displayRegisterForm: false
}, action) => {
  switch (action.type) {
    case uiTypes.TOGGLE_LOGIN_FORM:
      return {
        ...state,
        displayLoginForm: action.displayLoginForm
      };
    case uiTypes.TOGGLE_REGISTER_FORM:
      return {
        ...state,
        displayRegisterForm: action.displayRegisterForm
      };
    default:
      return state;
  }
};

// expanded 默认是空，使用时如果没有那个属性，就假设是false
const catalog = (state = { displayCatalog: false, isFetching: false, expanded: {} }, action) => {
  switch (action.type) {
    case uiTypes.TOGGLE_EXPAND_BTN:
      return { ...state, expanded: { ...state.expanded, [action.id]: !state.expanded[action.id] } };
    case uiTypes.TOGGLE_CATALOG:
      return { ...state, displayCatalog: action.displayCatalog };
    case bookTypes.BOOK_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case bookTypes.BOOK_SUCCESS:
    case bookTypes.BOOK_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};

const preview = (state = { isFetching: false }, action) => {
  switch (action.type) {
    case articleTypes.ARTICLE_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case articleTypes.ARTICLE_FAILURE:
    case articleTypes.ARTICLE_SUCCESS:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};

const editor = (state = { isFetching: false }, action) => {
  switch (action.type) {
    case articleTypes.ARTICLE_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case articleTypes.ARTICLE_FAILURE:
    case articleTypes.ARTICLE_SUCCESS:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};

const ui = combineReducers({
  navbar,
  preview,
  screen,
  catalog,
  popwindow,
  editor
});
// #endregion

// Updates error message to notify about the failed fetches.
const requestError = (state = null, action) => {
  const { type, requestError: error } = action;

  if (type === actions.types.RESET_REQUEST_ERROR) {
    return null;
  } else if (error) {
    return error;
  }

  return state;
};

const rootReducer = combineReducers({
  auth,
  entities,
  result,
  ui,
  requestError,
  form: formReducer
});

export default rootReducer;
