export const TOGGLE_CATALOG = 'TOGGLE_CATALOG';
export const SCREEN_RESIZE = 'SCREEN_RESIZE';
export const TOGGLE_EXPAND_BTN = 'TOGGLE_EXPAND_BTN';
export const TOGGLE_LOGIN_FORM = 'TOGGLE_LOGIN_FORM';
export const TOGGLE_REGISTER_FORM = 'TOGGLE_REGISTER_FORM';


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

function screenResize(width) {
  return {
    type: SCREEN_RESIZE,
    screenWidth: width
  };
}

export default {
  toggleCatalog, screenResize, toggleExpandBtn, toggleLoginForm, toggleRegisterForm
};
