import { CALL_API, Schemas } from '../middleware/api';

export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';

const fetchUser = username => ({
  [CALL_API]: {
    types: [USER_REQUEST, USER_SUCCESS, USER_FAILURE],
    endpoint: `users/${username}`,
    apischema: Schemas.USER,
    result: 'user'
  }
});

// Fetches a single user from API unless it is cached.
// Relies on Redux Thunk middleware.
const loadUser = username => (dispatch, getState) => {
  const user = getState().entities.users[username];
  if (user) {
    return null;
  }
  return dispatch(fetchUser(username));
};

export default loadUser;
