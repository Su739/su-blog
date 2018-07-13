import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import Add from 'material-ui/svg-icons/content/add';
import dateFormatter from './utils/dateFormatter';
import './Book.css';

export const AddBookButton = ({ onClick }) => (
  <button onClick={onClick} className="book-pinned"><Add /></button>
);
AddBookButton.propTypes = {
  onClick: PropTypes.func
};

const Book = (props) => {
  const {
    id, username, name, description, updatedAt, createdAt,
    handleEditClick, handleDeleteClick, loginName
  } = props;
  return (
    <div className="book-pinned">
      <div className="book-pinned-content">
        <Link to={`/${username}/book/${id}/a`} className="book-pinned-title">{name}</Link>
        <span className="book-pinned-post-date">{dateFormatter(createdAt)}</span>
        <p className="book-pinned-description">{description}</p>
      </div>
      {loginName === username &&
        <div className="book-pinned-toolbar">
          <IconButton
            style={{
              width: '24px', height: '24px', padding: 0, marginLeft: '12px'
            }}
            tooltip="编辑"
            tooltipPosition="top-center"
            onClick={() => handleEditClick(id)}
          >
            <Edit color="rgba(39, 40, 34, 0.87)" />
          </IconButton>
          <IconButton
            style={{
              width: '24px', height: '24px', padding: 0, margin: '0 12px 0'
            }}
            tooltip="删除"
            tooltipPosition="top-center"
            onClick={() => handleDeleteClick(id)}
          >
            <Delete color="rgba(39, 40, 34, 0.87)" />
          </IconButton>
        </div>}
    </div>
  );
};

Book.propTypes = {
  id: PropTypes.number,
  loginName: PropTypes.string,
  username: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  createdAt: PropTypes.string,
  handleEditClick: PropTypes.func,
  handleDeleteClick: PropTypes.func
};
Book.defaultProps = {
  name: 'xxxx',
  description: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  updatedAt: '2018-05-15T11:07:01.418Z'
};

export default Book;
