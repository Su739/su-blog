export const TOGGLE_CATALOG = 'TOGGLE_CATALOG';
export const SCREEN_RESIZE = 'SCREEN_RESIZE';
export const TOGGLE_EXPAND_BTN = 'TOGGLE_EXPAND_BTN';
export const TOGGLE_LOGIN_FORM = 'TOGGLE_LOGIN_FORM';
export const TOGGLE_REGISTER_FORM = 'TOGGLE_REGISTER_FORM';
export const TOGGLE_BLOCKED_MODAL = 'TOGGLE_BLOCKED_MODAL';
export const LOADING_EDITOR = 'LOADING_EDITOR';
export const UPDATE_LATEST_SCROLL = 'UPDATE_LATEST_SCROLL';
export const TOGGLE_USER_PROFILE_FORM = 'TOGGLE_USER_PROFILE_FORM';
export const TOGGLE_BOOK_DETAIL_FORM = 'TOGGLE_BOOK_DETAIL_FORM';

function loadingEditor(loading) {
  return {
    type: LOADING_EDITOR,
    loading
  };
}

function toggleBlockedModal(display) {
  return {
    type: TOGGLE_BLOCKED_MODAL,
    displayBlockedModal: display
  };
}

function toggleLoginForm(display) {
  return {
    type: TOGGLE_LOGIN_FORM,
    displayLoginForm: display
  };
}

function toggleRegisterForm(display) {
  return {
    type: TOGGLE_REGISTER_FORM,
    displayRegisterForm: display
  };
}

function toggleCatalog(display) {
  return {
    type: TOGGLE_CATALOG,
    displayCatalog: display
  };
}

function toggleExpandBtn(id) {
  return {
    type: TOGGLE_EXPAND_BTN,
    id
  };
}

function toggleUserProfileForm(display) {
  return {
    type: TOGGLE_USER_PROFILE_FORM,
    displayUserProfileForm: display
  };
}

function toggleBookDetailForm(display) {
  return {
    type: TOGGLE_BOOK_DETAIL_FORM,
    displayBookDetailForm: display
  };
}

function screenResize(width, height) {
  return {
    type: SCREEN_RESIZE,
    screenWidth: width,
    screenHeight: height
  };
}

function updateLatestScroll(latestScroll) {
  return {
    type: UPDATE_LATEST_SCROLL,
    latestScroll
  };
}

export default {
  toggleCatalog,
  screenResize,
  toggleExpandBtn,
  toggleLoginForm,
  toggleRegisterForm,
  toggleBlockedModal,
  loadingEditor,
  updateLatestScroll,
  toggleUserProfileForm,
  toggleBookDetailForm
};
