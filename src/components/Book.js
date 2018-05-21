import React from 'react';
import PropTypes from 'prop-types';

const Book = (props) => {
  const {
    name, description, bookCover, bookId,
  } = props;
  console.log(bookId);
  function editBookDetail(id) {
    console.log(id);
    props.setEditBookId(id);
  }
  return (
    <li className="book-pinned">
      <div className="book-pinned-content">
        <span className="book-pinned-title">{name}</span>
        <span className="book-pinned-post-date">3/1/18</span>
        <p className="book-pinned-description">{description}</p>
      </div>
      <img className="book-pinned-cover" src={bookCover} alt={name} title={name} />
      <div className="book-pinned-dash">
        <button onClick={e => editBookDetail(bookId, e)}>
          <i className="iconfont icon-pen_" />
        </button>
        <button>
          <i className="iconfont icon-dustbin" />
        </button>
      </div>
    </li>
  );
};

Book.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  bookCover: PropTypes.string.isRequired,
  bookId: PropTypes.number.isRequired,
  setEditBookId: PropTypes.func,
};
