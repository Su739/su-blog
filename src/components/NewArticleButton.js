import React from 'react';
import PropTypes from 'prop-types';
import AddCircle from 'material-ui/svg-icons/content/add';
import './NewArticleButton.css';

const NewArticleButton = (props) => {
  const { onClick } = props;
  return (
    <button className="new-article-btn" onClick={onClick}>
      <AddCircle style={{ color: '#0c9400' }} /> 新建文章
    </button>
  );
};

NewArticleButton.propTypes = {
  onClick: PropTypes.func
};

export default NewArticleButton;
