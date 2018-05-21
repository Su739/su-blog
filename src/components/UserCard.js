import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// 关注暂时占位
const UserCard = ({
  loginName, username, avatar, nickname, company, gender, profession,
}) => (
  <div className="card">
    <div className="card-avatar-container">
      <Link to="/acount">
        <img className="card-avatar" src={avatar} alt={`${nickname}'s avatar`} />
      </Link>
    </div>
    <p className="card-nickname">{nickname}</p>
    <p className="card-gender">
      {gender === 'male' ? (
        <i className="iconfont icon-sharemale" />
      ) : (
        <i className="iconfont icon-sharefemale" />
      )}
    </p>
    {loginName && loginName === username ? (
      <button className>编辑个人信息</button>
    ) : (
      <button>关注</button>
    )}
    <p className="card-profession">{profession}</p>
    <p className="card-company">{company}</p>
  </div>
);

UserCard.propTypes = {
  avatar: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  company: PropTypes.string,
  gender: PropTypes.string,
  profession: PropTypes.string,
  loginName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};
