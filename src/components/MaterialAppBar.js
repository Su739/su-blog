import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Power from 'material-ui/svg-icons/action/power-settings-new';
import { Link } from 'react-router-dom';
import './MaterialAppBar.css';
import rootUrl from '../utils/rootUrl';

// 标题
const Title = ({ avatarUrl, name, nick }) => (
  <span className="bar-title"><Link to={`/${name}`}><Avatar size={24} src={`${rootUrl}/avatars/${avatarUrl}`} />{`${nick}的博客`}</Link></span>
);
Title.propTypes = {
  avatarUrl: PropTypes.string,
  name: PropTypes.string,
  nick: PropTypes.string
};

const TitleOnLoading = () => (
  <span className="bar-title">
    <span className="title-avatar-loading" />
    <span className="title-loading" />
  </span>
);

// 如果已登录，就渲染这个
const Logged = ({
  avatarUrl, loginName, logoutUrl, loginNick, refreshAuthentication
}) => (
  <IconMenu
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    iconStyle={{ color: '#fff' }}
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
  >
    <MenuItem containerElement={<Link to={`/${loginName}`} />} leftIcon={<Avatar src={`${rootUrl}/avatars/${avatarUrl}`} />} primaryText={loginNick} />
    <MenuItem
      onClick={() => axios
        .get(logoutUrl, { withCredentials: true })
          .then(() => refreshAuthentication(false, null))
        }
      leftIcon={<Power />}
      primaryText="退出登录"
      variant="button"
    />
  </IconMenu>
);
Logged.propTypes = {
  avatarUrl: PropTypes.string,
  loginName: PropTypes.string,
  logoutUrl: PropTypes.string,
  loginNick: PropTypes.string,
  refreshAuthentication: PropTypes.func
};

// bar
const MaterialAppBar = ({
  ownerName, loginName, screenWidth, loginUser, blogOwner, isFetching,
  handleToggleCatalog, toggleLoginForm, refreshAuthentication
}) => {
  if (isFetching) {
    return (
      <AppBar
        style={{ position: 'fixed', top: '0' }}
        title={<TitleOnLoading />}
        titleStyle={{ display: 'flex', alignItems: 'center' }}
        showMenuIconButton={screenWidth < 768}
      />
    );
  }
  return (
    <div>
      <AppBar
        style={{ position: 'fixed', top: '0' }}
        title={
          blogOwner
          ?
            <Title
              avatarUrl={blogOwner.UserProfile.avatar}
              name={ownerName}
              nick={blogOwner.UserProfile.nickName}
            />
          :
            <span className="bar-title"><Link to="/">TreeBook</Link></span>
        }
        titleStyle={{ display: 'flex', alignItems: 'center' }}
        showMenuIconButton={screenWidth < 768}
        onLeftIconButtonClick={() => handleToggleCatalog(true)}
        iconElementRight={
          loginName
          ?
            <Logged
              loginNick={loginUser.UserProfile.nickName}
              loginName={loginName}
              logoutUrl={`${rootUrl}/auth/logout`}
              avatarUrl={loginUser.UserProfile.avatar}
              refreshAuthentication={refreshAuthentication}
            />
          : <FlatButton label="登录" onClick={() => toggleLoginForm(true)} />}
      />
    </div>
  );
};
MaterialAppBar.propTypes = {
  ownerName: PropTypes.string,
  loginName: PropTypes.string,
  isFetching: PropTypes.bool,
  screenWidth: PropTypes.number,
  loginUser: PropTypes.objectOf(PropTypes.any),
  blogOwner: PropTypes.objectOf(PropTypes.any),
  handleToggleCatalog: PropTypes.func,
  toggleLoginForm: PropTypes.func,
  refreshAuthentication: PropTypes.func
};

export default MaterialAppBar;
