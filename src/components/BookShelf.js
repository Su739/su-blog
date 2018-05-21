import React from 'react';
import PropTypes from 'prop-types';
import './BookShelf.css';

/** default time-desc
 * @param {object} b1  book
 * @param {object} b2  book
 * @param {string} method
 */
function compareBooks(method) {
  return function compare(b1, b2) {
    switch (method) {
      case 'time-asc':
        if (b1.postDate < b2.postDate) {
          return -1;
        } else if (b1.postDate > b2.postDate) {
          return 1;
        }
        return 0;
      case 'time-desc':
        if (b1.postDate < b2.postDate) {
          return 1;
        } else if (b1.postDate > b2.postDate) {
          return -1;
        }
        return 0;

      default:
        if (b1.postDate < b2.postDate) {
          return 1;
        } else if (b1.postDate > b2.postDate) {
          return -1;
        }
        return 0;
    }
  };
}

class BookShelf extends React.Component {
  static propTypes = {
    bookList: PropTypes.arrayOf(PropTypes.object),
    setEditBookId: PropTypes.func,
  };
  static defaultProps = {
    bookList: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      order: 'time-asc',
    };
    this.setOrder = this.setOrder.bind(this);
  }
  setOrder(e) {
    this.setState({
      order: e.target.id,
    });
  }
  render() {
    const orderBooks = this.props.bookList.sort(compareBooks(this.state.order));
    const bookList = orderBooks.map((book) => {
      const {
        name, description, bookCover, bookId,
      } = book;
      return (
        <Book
          key={name}
          name={name}
          description={description}
          bookCover={bookCover}
          bookId={bookId}
          setEditBookId={this.props.setEditBookId}
        />
      );
    });
    return (
      <div className="shelf-container">
        <h3>——书架——</h3>
        <p>全部图书:</p>
        <ul className="shelf-books-place">{bookList}</ul>
      </div>
    );
  }
}

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

export default BookShelf;
