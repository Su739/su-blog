/**
 * anywhere need authentication status, dispatch this action
 */
import cookieParser from '../utils/cookieParser';

export const REFRESH_AUTHENTICATION = 'REFRESH_AUTHENTICATION';

function refreshAuthentication() {
  return (dispatch) => {
    const isLoged = cookieParser.getValue('isLogged');
    if (isLoged) {
      const userName = cookieParser.getValue('userName');
      return Promise.resolve(dispatch({
        type: REFRESH_AUTHENTICATION,
        isLogged: true,
        loginName: userName
      }));
    }

    return Promise.resolve(dispatch({
      type: REFRESH_AUTHENTICATION,
      isLogged: false,
      loginName: null
    }));
  };
}

// 为了开发方便，不使用cookie，也用不了,document.cookie只能获得当前domain的cookie
function refreshAuthentication2(isLogged, loginName) {
  return (dispatch) => {
    console.log(loginName);
    return Promise.resolve(dispatch({
      type: REFRESH_AUTHENTICATION,
      isLogged,
      loginName
    }));
  };
}

export default process.env.NODE_ENV === 'development' ? refreshAuthentication2 : refreshAuthentication;
