import axios from 'axios';
import { schema, normalize } from 'normalizr';

/* 留着这一段是告诉自己，不能循环引用。。。在各种action中已经引用api.js
import actions from '../actions';

console.log(actions); */

const API_ROOT = 'https://www.lg739.com/api/'; // 这里有 '/' action中的url开头不要加‘/'

// Extracts the next page URL from Github API response.
const getNextPageUrl = (response) => {
  const { link } = response.headers;
  if (!link) {
    return null;
  }

  const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1);
  if (!nextLink) {
    return null;
  }

  return nextLink.trim().split(';')[0].slice(1, -1);
};

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (endpoint, apischema, result) => {
  const fullUrl = endpoint.indexOf(API_ROOT) === -1 ? API_ROOT + endpoint : endpoint;

  return axios.get(fullUrl, { withCredentials: true })
    .then(
      (response) => {
        const nextPageUrl = getNextPageUrl(response);
        return { ...normalize(response.data, apischema), nextPageUrl };
      },
      error => Promise.reject(error)
    );
};
const articleSchema = new schema.Entity('articles');
const bookSchema = new schema.Entity('books', { articles: [articleSchema] });
const userSchema = new schema.Entity('users', { Books: [bookSchema] }, { idAttribute: 'userName' });

// Schemas for API responses.
export const Schemas = {
  USER: userSchema,
  BOOK: bookSchema,
  ARTICLE: articleSchema,
  articleListSchema: [articleSchema]
};

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API';

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
// eslint-disable-next-line no-unused-vars
export default store => next => (action) => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const {
    types, apischema, endpoint, result
  } = callAPI;

  if (typeof endpoint !== 'string') {
    throw new Error('endpoint URL应该设置成字符串');
  }
  if (!apischema) {
    throw new Error('确认action中存在apischema字段');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('请确认action是一个api请求action，然后更正types');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('types内应为string类型');
  }
  if (typeof result !== 'string') {
    throw new Error('结果属性的名称result应该是一个字符串');
  }

  const actionWith = (data) => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  };
  // 清除数据请求错误,因为不能引用actions(循环引用)，所以就硬写。。
  next(actionWith({ type: 'RESET_REQUEST_ERROR' }));

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));

  return callApi(endpoint, apischema, result).then(
    response =>
      next(actionWith({
        response,
        type: successType
      })),
    error =>
      next(actionWith({
        type: failureType,
        requestError: {
          message: error.response ? (error.response.data.error || 'Something bad happened') : error.message,
          status: error.response && error.response.status
        }
      }))
  );
};
