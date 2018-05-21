/**
 * anywhere need authentication status, dispatch this action
 * 哈哈，没想到吧，cookie要从ajax结果中读，其实仔细想想，react是要部署到服务器的，而且他和api server 毫无关系。。注释代码留着提醒自己
 * 哈哈，上面这段好sb，cookie要同源。。。哎都留着吧，反正我就是s
 */
import cookieParser from '../utils/cookieParser';

export const REFRESH_AUTHENTICATION = 'REFRESH_AUTHENTICATION';

function refreshAuthentication() {
  console.log('111');
  return (dispatch) => {
    const isLoged = cookieParser.getValue('isLoged');
    if (isLoged) {
      const userName = cookieParser.getValue('userName');
      return dispatch({
        type: REFRESH_AUTHENTICATION,
        isLogged: true,
        loginName: userName
      });
    }

    return dispatch({
      type: REFRESH_AUTHENTICATION,
      isLogged: false,
      loginName: null
    });
  };
}

// 为了开发方便，不使用cookie，也用不了,document.cookie只能获得当前domain的cookie
function refreshAuthentication2(isLogged, loginName) {
  console.log(loginName);
  return {
    type: REFRESH_AUTHENTICATION,
    isLogged,
    loginName
  };
}

export default process.env.NODE_ENV === 'development' ? refreshAuthentication2 : refreshAuthentication;
