import React from 'react';
import PropTypes from 'prop-types';
import './Error404.css';

const DEFAULT_404_MESSAGE = '糟糕，您请求的资源不存在！！！';

// 额，一个显示404错误的组件。
const Error404 = ({ message, statusCode }) => (
  <div className="page-404">
    <div className="page-404-message">
      <h1>{statusCode}</h1>
      <h2>{message || DEFAULT_404_MESSAGE}</h2>
    </div>
  </div>
);

Error404.propTypes = {
  message: PropTypes.string,
  statusCode: PropTypes.oneOf([PropTypes.number, PropTypes.string])
};

export default Error404;
