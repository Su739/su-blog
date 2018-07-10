import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../actions';
import MaterialAppBar from '../components/MaterialAppBar';

class NavBar extends React.Component {
  static propTypes = {
    toggleLoginForm: PropTypes.func.isRequired,
    refreshAuthentication: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
    isFetching: PropTypes.bool,
    screenResize: PropTypes.func.isRequired,
    toggleCatalog: PropTypes.func.isRequired,
    displayLeftIcon: PropTypes.bool,
    loginName: PropTypes.string,
    ownerName: PropTypes.string,
    loginUser: PropTypes.objectOf(PropTypes.any),
    screenWidth: PropTypes.number,
    blogOwner: PropTypes.objectOf(PropTypes.any)
  }
  componentDidMount() {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);// eslint-disable-line no-undef

    const {
      loginName, ownerName, loadUser, blogOwner, loginUser, refreshAuthentication
    } = this.props;
    if (process.env.NODE_ENV === 'production') {
      refreshAuthentication();
    }
    if (loginName && !loginUser) {
      loadUser(loginName);
    }
    if (ownerName && !blogOwner) {
      loadUser(ownerName);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.ownerName !== this.props.ownerName && this.props.ownerName !== null) {
      this.props.loadUser(this.props.ownerName);
    }
    if (prevProps.loginName !== this.props.loginName && this.props.loginName !== null) {
      this.props.loadUser(this.props.loginName);
    }
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-undef
    window.removeEventListener('resize', this.handleResize);
  }
  handleResize() {
    // eslint-disable-next-line no-undef
    this.props.screenResize(window.innerWidth, window.innerHeight);
  }

  render() {
    const {
      ownerName, loginName, loginUser, blogOwner, isFetching, displayLeftIcon,
      toggleCatalog: handleToggleCatalog, toggleLoginForm, refreshAuthentication
    } = this.props;
    return (
      <div>
        <MaterialAppBar
          isFetching={isFetching && !blogOwner}// isFetching仅能说明正在请求user，但请求的user不一定是blogOwner
          ownerName={ownerName}
          loginName={loginName}
          handleToggleCatalog={handleToggleCatalog}
          screenWidth={this.props.screenWidth}
          loginUser={loginUser}
          blogOwner={blogOwner}
          toggleLoginForm={toggleLoginForm}
          refreshAuthentication={refreshAuthentication}
          displayLeftIcon={displayLeftIcon}
        />
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const { ownerName } = ownProps;
  const {
    auth: { isLogged, loginName },
    entities: { users },
    ui: { app: { screenSize: { width }, navbar: { isFetching } } }
  } = state;

  // 如果当前store中没有这个用户，显然返回undefined，然后参数在使用时要判断，没有的话要自己load，并处理ui渲染
  const blogOwner = users ? users[ownerName] : null;
  const loginUser = users ? users[loginName] : null;

  return {
    isFetching,
    screenWidth: width,
    isLogged, // 登录状态，以及登录的username
    loginName, // 名字
    ownerName,
    loginUser, // 实体。。名字对应的用户详细信息
    blogOwner
  };
};

const {
  screenResize, toggleCatalog, loadUser, refreshAuthentication, toggleLoginForm
} = actions;
const mapDispatchToProps = dispatch =>
  ({
    screenResize: (width, height) => dispatch(screenResize(width, height)),
    toggleCatalog: display => dispatch(toggleCatalog(display)),
    loadUser: username => dispatch(loadUser(username)),
    refreshAuthentication: (a, b) => dispatch(refreshAuthentication(a, b)),
    toggleLoginForm: display => dispatch(toggleLoginForm(display))
  });

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
