import { CALL_API, Schemas } from '../middleware/api';

export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';
export const ADD_USER_ON_EDIT = 'ADD_USER_ON_EDIT';
export const ADD_USER_ENTITY = 'ADD_USER_ENTITY';
export const UPDATE_USER_ENTITY = 'UPDATE_USER_ENTITY';
export const DELETE_USER_ENTITY = 'DELETE_USER_ENTITY';

const addUserOnEdit = user => ({
  type: ADD_USER_ON_EDIT,
  user
});

const addUserEntity = user => ({
  type: ADD_USER_ENTITY,
  user
});

const updateUserEntity = user => ({
  type: UPDATE_USER_ENTITY,
  user
});

const deleteUserEntity = id => ({
  type: DELETE_USER_ENTITY,
  id
});

const fetchUser = username => ({
  [CALL_API]: {
    types: [USER_REQUEST, USER_SUCCESS, USER_FAILURE],
    endpoint: `users/${username}`,
    apischema: Schemas.USER,
    method: 'get'
  }
});

// Fetches a single user from API unless it is cached.
// Relies on Redux Thunk middleware.
const loadUser = (username, refresh) => (dispatch, getState) => {
  const user = getState().entities.users[username];
  if (user && !refresh) {
    return Promise.resolve(null);
  }
  return dispatch(fetchUser(username));
};

export default {
  loadUser, addUserEntity, updateUserEntity, deleteUserEntity
};
