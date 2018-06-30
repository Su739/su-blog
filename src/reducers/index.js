import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import omit from 'lodash/omit';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import union from 'lodash/union';
import actions from '../actions';

const {
  types: {
    uiTypes, articleTypes, bookTypes, authTypes, userTypes, editingDataTypes, articleListTypes
  }
} = actions;

const auth = (state = { isLogged: false, loginName: null }, action) => {
  if (action.type === authTypes.REFRESH_AUTHENTICATION) {
    return {
      ...state,
      isLogged: action.isLogged,
      loginName: action.loginName
    };
  }
  return state;
};

const users = (state = {}, action) => {
  switch (action.type) {
    case bookTypes.ADD_BOOK_ENTITY:
      return {
        ...state,
        [action.writername]: {
          ...state[action.writername],
          books: state[action.writername].books.concat(action.book.id)
        }
      };
    case userTypes.ADD_USER_ENTITY:
      return { ...state, [action.user.userName]: action.user };
    case userTypes.UPDATE_USER_ENTITY:
      return { ...state, [action.user.id]: action.user };
    case userTypes.DELETE_USER_ENTITY:
      return omit(state, action.id);
    default:
      return state;
  }
};

const books = (state = {}, action) => {
  switch (action.type) {
    case articleTypes.ADD_ARTICLE_ENTITY:
      return {
        ...state,
        [action.bookid]: {
          ...state[action.bookid],
          articles: state[action.bookid].articles.concat(action.article.id)
        }
      };
    case bookTypes.ADD_BOOK_ENTITY:
      return { ...state, [action.book.id]: action.book };
    case bookTypes.UPDATE_BOOK_ENTITY:
      return { ...state, [action.book.id]: action.book };
    default:
      return state;
  }
};

const articles = (state = {}, action) => {
  switch (action.type) {
    case articleTypes.ADD_ARTICLE_ENTITY:
      return { ...state, [action.article.id]: action.article };
    case articleTypes.UPDATE_ARTICLE_ENTITY:
      return { ...state, [action.article.id]: action.article };
    default:
      return state;
  }
};

const entities = (state = { users: {}, books: {}, articles: {} }, action) => {
  // Updates an entity cache in response to any action with response.entities.
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }

  return {
    users: users(state.users, action),
    articles: articles(state.articles, action),
    books: books(state.books, action)

  };
};


const articleList = (state = {
  isFetching: false,
  nextPageUrl: undefined,
  pageCount: 0,
  ids: []
}, action) => {
  switch (action.type) {
    case articleListTypes.ARTICLE_LIST_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case articleListTypes.ARTICLE_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: union(state.ids, action.response.result),
        nextPageUrl: action.response.nextPageUrl,
        pageCount: state.pageCount + 1
      };
    case articleListTypes.ARTICLE_LIST_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};

const pagination = combineReducers({
  articleList
});

/**
 * store some editing data,the articles data use array
 * @param {object} state
 * @param {array} action.articles
 */
/*
const editingData = (state = {}, action) => {
  switch (action.type) {
    case editingDataTypes.INITIAL_EDITING_DATA:
      return cloneDeep({ booksById: action.booksById, articles: sortCatalog(action.articlesById) });
    case editingDataTypes.ADD_ARTICLE:
      return {
        articles: sortCatalog(state.articles.concat(action.newArticle)),
        booksById: {
          ...state.booksById,
          [action.newArticle.parent]: {
            ...state.booksById[[action.newArticle.parent]],
            articles: state.booksById[[action.newArticle.parent]]
              .articles.concat(action.newArticle.id)
          }
        }
      };
    case editingDataTypes.REMOVE_ARTICLE:
      return {
        ...state,
        articlesById: state.articles.filter(a => a.id !== action.id),
        booksById: {
          ...state.booksById,
          [action.newArticle.parent]: {
            ...state.booksById[[action.newArticle.parent]],
            articles: state.booksById[[action.newArticle.parent]]
              .articles.slice(0, -1)
          }
        }
      };
    case editingDataTypes.DESTROY_BLOCKED_ARTICLE:
      return omit(state, ['blockedArticle']);
    case editingDataTypes.DESTROY_EDITING_DATA:
      return {};
    default:
      return state;
  }
};
*/

// store some editing data
const editingData = (state = {}, action) => {
  switch (action.type) {
    case editingDataTypes.INITIAL_EDITING_DATA:
      return cloneDeep({ booksById: action.booksById, articlesById: action.articlesById });
    case editingDataTypes.ADD_ARTICLE:
      return {
        ...state,
        articlesById: {
          ...state.articlesById,
          [action.newArticle.id]: action.newArticle
        },
        booksById: {
          ...state.booksById,
          [action.newArticle.parent]: {
            ...state.booksById[action.newArticle.parent],
            articles: state.booksById[action.newArticle.parent]
              .articles.concat(action.newArticle.id)
          }
        },
        newArticle: action.newArticle
      };
    // 删除数据集合中的 -1项，删除newArticle
    case editingDataTypes.REMOVE_ARTICLE:
      if (state.articlesById[action.id]) {
        return omit({
          ...state,
          articlesById: omit(state.articlesById, [action.id]),
          booksById: {
            ...state.booksById,
            [state.articlesById[action.id].parent]: {
              ...state.booksById[state.articlesById[action.id].parent],
              articles: state.booksById[state.articlesById[action.id].parent]
                .articles.slice(0, -1)
            }
          }
        }, ['newArticle']);
      }
      return state;
    case editingDataTypes.ADD_BLOCKED_ARTICLE:
      return {
        ...state,
        blockedArticle: action.blockedArticle
      };
    case editingDataTypes.UPDATE_ARTICLE:
      if (action.newArticle.parent) {
        return {
          ...state,
          articlesById: {
            ...state.articlesById,
            [action.newArticle.id]: {
              ...state.articlesById[action.newArticle.id],
              ...action.newArticle
            }
          },
          booksById: {
            ...state.booksById,
            [action.newArticle.parent]: {
              ...state.booksById[action.newArticle.parent],
              // 加上，然后去重，为了能在post新文章后，使用他来增加新文章
              articles: [
                ...new Set(state
                  .booksById[action.newArticle.parent].articles.concat(action.newArticle.id))
              ]
            }
          }
        };
      }
      return {
        ...state,
        articlesById: {
          ...state.articlesById,
          [action.newArticle.id]: {
            ...state.articlesById[action.newArticle.id],
            ...action.newArticle
          }
        }
      };
    case editingDataTypes.REMOVE_BLOCKED_ARTICLE:
      return omit(state, ['blockedArticle']);
    case editingDataTypes.CANCEL_ARTICLE_CHANGE:
      return {
        ...state,
        articlesById: {
          ...state.articlesById,
          [action.article.id]: action.article
        }
      };
    case editingDataTypes.DESTROY_EDITING_DATA:
      return {};
    default:
      return state;
  }
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
const screen = (state = { width: window.innerWidth, height: window.innerHeight }, action) => {
  switch (action.type) {
    case uiTypes.SCREEN_RESIZE:
      return { width: action.screenWidth, height: action.screenHeight };
    default:
      return state;
  }
};

// eslint-disable-next-line no-undef
const latestScroll = (state = document.documentElement.scrollTop, action) => {
  switch (action.type) {
    case uiTypes.UPDATE_LATEST_SCROLL:
      return action.latestScroll;
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
  displayLoginForm: false,
  displayRegisterForm: false,
  displayBlockedModal: false,
  displayUserProfileForm: false
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
    case uiTypes.TOGGLE_BLOCKED_MODAL:
      return {
        ...state,
        displayBlockedModal: action.displayBlockedModal
      };
    case uiTypes.TOGGLE_USER_PROFILE_FORM:
      return {
        ...state,
        displayUserProfileForm: action.displayUserProfileForm
      };
    case uiTypes.TOGGLE_BOOK_DETAIL_FORM:
      return {
        ...state,
        displayBookDetailForm: action.displayBookDetailForm
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

const editor = (state = { isFetching: false, loading: true }, action) => {
  switch (action.type) {
    case uiTypes.LOADING_EDITOR:
      return {
        ...state,
        loading: action.loading
      };
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

const userPage = (state = { isFetching: false }, action) => {
  switch (action.type) {
    case userTypes.USER_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case userTypes.USER_FAILURE:
    case userTypes.USER_SUCCESS:
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
  latestScroll,
  catalog,
  popwindow,
  editor,
  userPage
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
  pagination,
  result,
  ui,
  requestError,
  form: formReducer,
  editingData
});

export default rootReducer;
