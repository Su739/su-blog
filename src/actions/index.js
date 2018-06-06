import loadArticle, * as articleTypes from './loadArticle';
import loadBook, * as bookTypes from './loadBook';
import loadUser, * as userTypes from './loadUser';
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
    authTypes
  },
  loadArticle,
  loadBook,
  loadUser,
  resetRequestError,
  refreshAuthentication,
  ...uiActions,
  ...editingDataActions
};
