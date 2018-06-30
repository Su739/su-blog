import articleActions, * as articleTypes from './articleActions';
import bookActions, * as bookTypes from './bookActions';
import userActions, * as userTypes from './userActions';
import loadArticleList, * as articleListTypes from './loadArticleList';
import uiActions, * as uiTypes from './ui';
import editingDataActions, * as editingDataTypes from './editingData';
import refreshAuthentication, * as authTypes from './refreshAuthentication';

const RESET_REQUEST_ERROR = 'RESET_REQUEST_ERROR';
// Resets the currently visible error message.
const resetRequestError = () => ({
  type: RESET_REQUEST_ERROR
});

export default {
  types: {
    articleTypes,
    bookTypes,
    userTypes,
    RESET_REQUEST_ERROR,
    uiTypes,
    editingDataTypes,
    authTypes,
    articleListTypes
  },
  ...articleActions,
  ...bookActions,
  ...userActions,
  resetRequestError,
  refreshAuthentication,
  loadArticleList,
  ...uiActions,
  ...editingDataActions
};
