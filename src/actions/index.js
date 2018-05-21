import loadArticle, * as articleTypes from './loadArticle';
import loadBook, * as bookTypes from './loadBook';
import loadUser, * as userTypes from './loadUser';
import uiActions, * as uiTypes from './ui';
import refreshAuthentication, * as authTypes from './refreshAuthentication';

const {
  toggleCatalog, screenResize, toggleExpandBtn, toggleLoginForm, toggleRegisterForm
} = uiActions;

const RESET_REQUEST_ERROR = 'RESET_REQUEST_ERROR';
// Resets the currently visible error message.
export const resetRequestError = () => ({
  type: RESET_REQUEST_ERROR
});

export default {
  types: {
    articleTypes,
    bookTypes,
    userTypes,
    RESET_REQUEST_ERROR,
    uiTypes,
    authTypes
  },
  loadArticle,
  loadBook,
  loadUser,
  resetRequestError,
  screenResize,
  toggleCatalog,
  toggleExpandBtn,
  refreshAuthentication,
  toggleLoginForm,
  toggleRegisterForm
};
